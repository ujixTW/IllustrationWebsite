import { useRef, useState } from "react";
import style from "../../../assets/CSS/components/artwork/Edit/EditTag.module.css";
import Lock from "../../../assets/SVG/lock.svg?react";
import WarnIcon from "../../../assets/SVG/warnIcon.svg?react";
import { TagType } from "../../../data/typeModels/artwork";
import { NormalBtn } from "../../Button/BasicButton";
import JumpWindow from "../../JumpWindow";
import AutoComplete from "../../searchbox/autoComplete";
import { ChangeEvent, FormEvent } from "../../../utils/tsTypesHelper";
import axios from "axios";

function EditTag(props: {
  artworkId: number;
  isOwn: boolean;
  tagList: TagType[];
  setTagList: React.Dispatch<React.SetStateAction<TagType[]>>;
  closeFnc: (...args: any[]) => any;
}) {
  const maxTagCount = 10;
  const [add, setAdd] = useState(false);
  const [newTag, setNewTag] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (tag: TagType) => {
    await axios
      .post("/api/Tag/Edit", tag, {
        params: { workId: props.artworkId },
      })
      .then((res) => {
        const data: TagType[] = res.data;
        props.setTagList(data);
      })
      .catch((err) => console.log(err));
  };
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (newTag.trim() == "") return;

    await axios
      .post(
        "/api/Tag/Edit",
        { id: null, content: newTag },
        { params: { workId: props.artworkId } }
      )
      .then((res) => {
        const data: TagType[] = res.data;

        props.setTagList(data);
        setNewTag("");
      })
      .catch((err) => console.log(err));
  };
  const handleInput = (e: ChangeEvent) => {
    const value = e.target.value;
    if (value.length <= 30) setNewTag(e.target.value.toString());
  };

  const tagLiArr = props.tagList.map((tag) => (
    <li className={style["tag"]} key={tag.id}>
      <div>#{tag.content}</div>
      <button
        type="submit"
        className={style["delete-btn"]}
        onClick={() => handleDelete(tag)}
        disabled={!props.isOwn}
      >
        {props.isOwn ? <span className={style["delete"]}> x </span> : <Lock />}
      </button>
    </li>
  ));
  return (
    <JumpWindow closeFnc={props.closeFnc}>
      <div className={style["body"]}>
        <h1 className={style["title"]}>編輯作品標籤</h1>
        <aside className={style["warn-container"]}>
          <div className={style["warn"]}>
            <h2 className={style["warn-title"]}>
              <WarnIcon />
              作者以外的會員也可編輯此作品的標籤
            </h2>
            <p className={style["warn-text"]}>
              任何人都能新增作品的標籤，但僅有作者能刪除標籤。
            </p>
          </div>
        </aside>
        <div>
          <div className={style["list-title-container"]}>
            <div>
              <h2 className={style["list-title"]}>作品標籤</h2>
            </div>
            <div className={style["list-side"]}>
              {props.tagList.length + "/" + maxTagCount}
            </div>
          </div>
          <ul className={style["tag-container"]}>{tagLiArr}</ul>
          <form className={style["add-container"]} onSubmit={handleAdd}>
            {add ? (
              <div className={style["input-container"]}>
                <div>
                  <input
                    type="text"
                    className={style["input"]}
                    name="newTag"
                    value={newTag}
                    onChange={handleInput}
                    placeholder="請輸入30字以內的標籤文字"
                    ref={inputRef}
                    autoComplete="off"
                  />
                  <div className={style["end"]}>
                    {newTag.trim() != "" && (
                      <button
                        type="button"
                        className={style["cancel"]}
                        onClick={() => setNewTag("")}
                      >
                        x
                      </button>
                    )}
                    <span className={style["text-count"]}>
                      {newTag.length}/30
                    </span>
                  </div>

                  <AutoComplete
                    inputText={newTag}
                    setInputText={setNewTag}
                    target={inputRef}
                    changeAll
                    onTargetTop
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={style["check-btn"]}
                onClick={() => setAdd(true)}
              >
                新增標籤
              </button>
            )}
          </form>
        </div>
        <hr />
        <div className={style["close"]}>
          <NormalBtn text="關閉" onClick={props.closeFnc} />
        </div>
      </div>
    </JumpWindow>
  );
}
export default EditTag;
