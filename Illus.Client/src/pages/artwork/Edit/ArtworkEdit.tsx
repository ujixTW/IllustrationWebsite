import style from "../../../assets/CSS/pages/Artwork/Edit/ArtworkEdit.module.css";
import path from "../../../data/JSON/path.json";
import { useEffect, useReducer, useRef, useState } from "react";
import changeWebTitle from "../../../utils/changeWebTitle";
import { useAppSelector } from "../../../hooks/redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { artworkPostReducer } from "../../../data/reducer/artworkReducer";
import { ArtworkPostDataDef } from "../../../data/postData/artwork";
import ArtworkEditContainer from "./ArtworkEditContainer";
import {
  CancelBtn,
  NormalBtn,
  SureBtn,
} from "../../../components/Button/BasicButton";
import {
  ChangeEvent,
  ChangeTextareaEvent,
  KeyInputEvent,
} from "../../../utils/tsTypesHelper";
import { htmlReg } from "../../../utils/regexHelper";
import { ArtworkType, TagType } from "../../../data/typeModels/artwork";
import AutoComplete from "../../../components/searchbox/autoComplete";
import axios from "axios";
import OptionBtn from "../../../components/Button/OptionBtn";
import TimePicker from "../../../components/TimePicker";
import JumpWindow from "../../../components/JumpWindow";
import {
  ImagePathUrlListToFile,
  ImagePathUrlToFile,
} from "../../../utils/ImagePathHelper";
import useUnSavedChange from "../../../hooks/useUnsavedChange";
import getFormDataHelper from "../../../utils/formDataHelper";
import Loading from "../../../components/Loading";

function RequiredTag(props: { filled: boolean }) {
  return (
    <div className={style["required"]}>
      <div
        className={
          style["box"] + " " + style[props.filled ? "filled" : "not-filled"]
        }
      >
        必填
      </div>
    </div>
  );
}
function RequiredTitle(props: { filled: boolean; text: string }) {
  return (
    <div className={style["opt-title"]}>
      <span className={style[props.filled ? "filled" : "not-filled"]}>
        {props.text}
      </span>
    </div>
  );
}

function ArtworkEdit(props: { isCreate?: boolean }) {
  const [titleLimit, descriptionLimit, tagLimit] = [32, 3000, 10];
  const today = new Date();
  const userId = useAppSelector((state) => state.userData.id);
  const emailConfired = useAppSelector((state) => state.userData.emailConfirm);
  const isLogin = useAppSelector((state) => state.login);
  const [postData, postDataDispatch] = useReducer(
    artworkPostReducer,
    ArtworkPostDataDef
  );

  const [complete, setComplete] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isR18, setIsR18] = useState<boolean | undefined>();
  const [isAI, setIsAI] = useState<boolean | undefined>();
  const [scheduledPost, setScheduledPost] = useState(false);
  const [tagHistoryArr, setTagHistoryArr] = useState<string[]>([]);
  const [isDeleteCheck, setIsDeleteCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagInputFieldRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { artworkId } = useParams();

  const { setIsDirty, CheckUnsavedToLeaveModal } = useUnSavedChange();

  useEffect(() => {
    if (!isLogin || !emailConfired) return navigate(path.home);
    changeWebTitle(props.isCreate ? "投稿 - " : "編輯作品 - ");

    if (props.isCreate) {
      axios
        .get("/api/Work/Tag/GetUserHistory")
        .then((res) => {
          const data: TagType[] = res.data;
          const contentList = data.map((item) => item.content);
          setTagHistoryArr(contentList);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`/api/Work/${artworkId}`)
        .then(async (res) => {
          const data: ArtworkType = res.data;
          if (data.artistId !== userId) return navigate(path.home);

          const cover = await ImagePathUrlToFile(data.coverImg, "cover");
          const imgUrlArr = data.imgs.map((item) => item.artworkContent);
          const imgArr = await ImagePathUrlListToFile(imgUrlArr, "artwork");

          postDataDispatch({ type: "setId", payload: data.id });
          Promise.all(imgArr).then((res) => {
            const _imgArr: File[] = res.filter(
              (item) => item !== undefined
            ) as File[];
            postDataDispatch({
              type: "editImg",
              payload: _imgArr,
            });
          });

          if (cover) postDataDispatch({ type: "editCover", payload: cover });
          postDataDispatch({
            type: "editDescription",
            payload: data.description,
          });
          postDataDispatch({ type: "editIsAI", payload: data.isAI });
          setIsAI(data.isAI);
          postDataDispatch({ type: "editIsR18", payload: data.isR18 });
          setIsR18(data.isR18);
          postDataDispatch({
            type: "editPostTime",
            payload: new Date(data.postTime),
          });
          postDataDispatch({
            type: "editTag",
            payload: data.tags.map((item) => item.content),
          });
          postDataDispatch({ type: "editTitle", payload: data.title });
        })
        .catch(() => navigate("*"));
    }
  }, []);

  useEffect(() => {
    if (
      postData.imgs.length > 0 ||
      postData.title.replace(htmlReg, "").trim() !== "" ||
      postData.tags.length > 0 ||
      postData.description.replace(htmlReg, "").trim() !== ""
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }

    if (
      postData.imgs.length > 0 &&
      postData.title.replace(htmlReg, "").trim() !== "" &&
      postData.tags.length > 0 &&
      isAI !== undefined &&
      isR18 !== undefined
    ) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  }, [postData, isR18, isAI]);

  useEffect(() => {
    if (!scheduledPost)
      postDataDispatch({ type: "editPostTime", payload: new Date() });
  }, [scheduledPost]);
  useEffect(() => {
    if (sendSuccess)
      navigate(path.artworks.editSuccess, {
        state: { artworkData: postData, isCreate: props.isCreate === true },
      });
  }, [sendSuccess]);

  const handleTagInputBlur = async () => {
    await setTimeout(() => {
      const field = tagInputFieldRef.current;
      if (field) {
        const linkArr = field.children[1].children[0];

        if (
          [...linkArr.children].every((item) => item !== document.activeElement)
        )
          handleEditTag();
      }
    }, 0);
  };
  const handleTaginputKeyDown = (e: KeyInputEvent) => {
    if (e.key === "Enter") {
      handleEditTag();
    }
  };
  const handleEditTag = (_index?: number) => {
    const listCopy = [...postData.tags];
    if (_index != undefined) {
      listCopy.splice(_index, 1);
    } else {
      if (
        tagInput.replace(htmlReg, "").trim() !== "" &&
        postData.tags.length < 10 &&
        !postData.tags.some((item) => item == tagInput)
      ) {
        listCopy.push(tagInput);
      }
      setTagInput("");
    }
    postDataDispatch({ type: "editTag", payload: listCopy });
  };

  const handleSend = async () => {
    const copyData = Object.assign({}, postData);

    setIsLoading(true);

    copyData.title = copyData.title.replace(htmlReg, "").trim();
    copyData.description = copyData.description.replace(htmlReg, "").trimEnd();
    postDataDispatch({ type: "editTitle", payload: copyData.title });
    postDataDispatch({
      type: "editDescription",
      payload: copyData.description,
    });
    const formData = getFormDataHelper(copyData);

    await axios
      .post(`/api/Work/${props.isCreate ? "Add" : "Edit"}`, formData)
      .then(() => {
        setIsDirty(false);
        setIsLoading(false);
        setSendSuccess(true);
      })
      .catch(() => {
        alert(`${props.isCreate ? "投稿" : "編輯"}失敗，請稍後再試`);
        setIsLoading(false);
      });
  };
  const handleDelete = async () => {
    await axios
      .post(`/api/Work/Delete?workId=${artworkId}&workArtistId=${userId}`)
      .then(() => {
        setIsDirty(false);
        setTimeout(() => {
          navigate(path.home);
        }, 0);
      })
      .catch(() => alert("刪除失敗，請稍後再試"));
  };

  const tagList = postData.tags.map((_item, _index) => (
    <div
      key={_index}
      className={style["artwork-tag"]}
      onClick={() => handleEditTag(_index)}
    >
      {_item}
    </div>
  ));
  const tagHisList = tagHistoryArr.map((_item, _index) => (
    <button
      key={_index}
      type="button"
      className={style["history-tag"]}
      onClick={() => {
        const listCopy = [...postData.tags];
        listCopy.push(_item);
        postDataDispatch({ type: "editTag", payload: [...listCopy] });
      }}
    >
      {_item}
    </button>
  ));

  return (
    <div className={style["body"]}>
      {CheckUnsavedToLeaveModal}
      <ArtworkEditContainer
        postData={postData}
        postDataDispatch={postDataDispatch}
        isCreate={props.isCreate}
      />
      <div className={style["data-container"]}>
        <div className={style["data"]}>
          <div className={style["information"] + " " + style["container"]}>
            <div className={style["title"]}>
              <RequiredTag filled={postData.title.trim() !== ""} />
              <input
                type="text"
                name="title"
                className={style["input"] + " " + style["limit"]}
                value={postData.title}
                onChange={(e: ChangeEvent) => {
                  postDataDispatch({
                    type: "editTitle",
                    payload: e.target.value,
                  });
                }}
                placeholder="標題"
              />
              <span className={style["tip"]}>
                {postData.title.length + "/" + titleLimit}
              </span>
            </div>
            <hr className={style["border"]} />
            <div className={style["description"]}>
              <textarea
                className={style["input"]}
                rows={5}
                name="description"
                value={postData.description}
                onChange={(e: ChangeTextareaEvent) => {
                  postDataDispatch({
                    type: "editDescription",
                    payload: e.target.value,
                  });
                }}
                placeholder="說明"
              />
              <span className={style["tip"]}>
                {postData.description.length + "/" + descriptionLimit}
              </span>
            </div>
          </div>
          <div className={style["tag"] + " " + style["container"]}>
            {props.isCreate && (
              <label className={style["tag-container"]}>
                <RequiredTag filled={postData.tags.length > 0} />
                {tagList}
                {postData.tags.length < 10 && (
                  <div className={style["input-box"]} ref={tagInputFieldRef}>
                    <input
                      type="text"
                      ref={tagInputRef}
                      name="tag"
                      value={tagInput}
                      onChange={(e: ChangeEvent) => {
                        const text = e.target.value.replace(htmlReg, "").trim();
                        if (text.length <= 30) setTagInput(text);
                      }}
                      onKeyDown={handleTaginputKeyDown}
                      onBlur={handleTagInputBlur}
                      className={style["tag-input"]}
                      placeholder="標籤"
                      autoComplete="off"
                    />
                    <AutoComplete
                      inputText={tagInput}
                      setInputText={setTagInput}
                      target={tagInputRef}
                      changeAll
                      autoBlur
                    />
                  </div>
                )}

                <span className={style["tip"]}>
                  {postData.tags.length + "/" + tagLimit}
                </span>
              </label>
            )}
            {!props.isCreate && (
              <div className={style["tag-container"]}>
                <Link to={path.artworks.artwork + artworkId}>編輯標籤</Link>
              </div>
            )}
            {tagHisList.length > 0 && (
              <>
                <hr className={style["border"]} />
                <div className={style["recommand-container"]}>
                  <RequiredTitle
                    filled={postData.tags.length > 0}
                    text="推薦標籤"
                  />

                  <div className={style["recommand-list"]}>
                    <div className={style["history-list"]}>{tagHisList}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={style["age-limit"] + " " + style["container"]}>
            <RequiredTag filled={isR18 !== undefined} />
            <RequiredTitle filled={isR18 !== undefined} text="年齡限制" />
            <div className={style["radio-area"]}>
              <OptionBtn
                type="radio"
                name="isR18"
                onChange={() => {
                  setIsR18(false);
                  postDataDispatch({ type: "editIsR18", payload: false });
                }}
                checked={isR18 === false}
                text="全年齡"
                value="general"
              />
              <OptionBtn
                type="radio"
                name="isR18"
                onChange={() => {
                  setIsR18(true);
                  postDataDispatch({ type: "editIsR18", payload: true });
                }}
                checked={isR18 === true}
                text="R-18"
                value="r18"
              />
            </div>
          </div>
          <div className={style["ai"] + " " + style["container"]}>
            <RequiredTag filled={isAI !== undefined} />
            <RequiredTitle filled={isAI !== undefined} text="AI生成作品" />
            <div className={style["radio-area"]}>
              <OptionBtn
                type="radio"
                name="ai"
                onChange={() => {
                  setIsAI(true);
                  postDataDispatch({ type: "editIsAI", payload: true });
                }}
                checked={isAI === true}
                text="是"
                value="aiGenerated"
              />
              <OptionBtn
                type="radio"
                name="ai"
                onChange={() => {
                  setIsAI(false);
                  postDataDispatch({ type: "editIsAI", payload: false });
                }}
                checked={isAI === false}
                text="否"
                value="notAiGenerated"
              />
            </div>
          </div>
          <hr className={style["border"]} />
          {(props.isCreate || postData.postTime > today) && (
            <div className={style["post-time"] + " " + style["container"]}>
              <div className={style["opt-title"]}>定時投稿</div>
              <div className={style["input-area"]}>
                <OptionBtn
                  name="timing"
                  type="checkbox"
                  onChange={() => setScheduledPost(!scheduledPost)}
                  checked={scheduledPost}
                  text="指定投稿時間"
                />
                <div className={style["time-container"]}>
                  <div className={style["time"]}>
                    <TimePicker
                      type="date"
                      name="postDate"
                      value={postData.postTime}
                      minDate={today}
                      onChange={(_date: Date) =>
                        postDataDispatch({
                          type: "editPostTime",
                          payload: _date,
                        })
                      }
                      readonly={!scheduledPost}
                    />
                  </div>
                  {postData.postTime > today && (
                    <div className={style["time"]}>
                      <TimePicker
                        type="time"
                        name="postTime"
                        value={postData.postTime}
                        onChange={(_date: Date) =>
                          postDataDispatch({
                            type: "editPostTime",
                            payload: _date,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={style["check-container"]}>
            <div className={style["btn"]}>
              <SureBtn text="發佈" onClick={handleSend} disabled={!complete} />
            </div>
            {!props.isCreate && (
              <div className={style["btn"]}>
                <CancelBtn text="刪除" onClick={() => setIsDeleteCheck(true)} />
              </div>
            )}
            {isDeleteCheck && (
              <JumpWindow closeFnc={() => setIsDeleteCheck(false)}>
                <div className={style["delete-check"]}>
                  <h1 className={style["title"]}>確定要刪除作品嗎?</h1>
                  <div className={style["btn"]}>
                    <CancelBtn text="刪除" onClick={handleDelete} />
                  </div>
                  <div className={style["btn"]}>
                    <NormalBtn
                      text="取消"
                      onClick={() => setIsDeleteCheck(false)}
                    />
                  </div>
                </div>
              </JumpWindow>
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
export default ArtworkEdit;
