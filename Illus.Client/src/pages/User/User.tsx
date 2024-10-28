import { useEffect, useReducer, useState } from "react";
import style from "../../assets/CSS/pages/User/User.module.css";
import path from "../../data/JSON/path.json";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { userDataType } from "../../data/typeModels/user";
import axios from "axios";
import { ArtworkListType } from "../../data/typeModels/artwork";
import CoverEditor from "../../components/User/CoverEditor";
import userDataHelper, { userHeadshotHelper } from "../../utils/userDataHelper";
import { NormalBtn, SureBtn } from "../../components/Button/BasicButton";
import useFollowUser from "../../hooks/useFollowUser";
import ArtworkListContainer from "../../components/artwork/ArtworkListContainer";
import { ChangeEvent, ChangeTextareaEvent } from "../../utils/tsTypesHelper";
import JumpWindow from "../../components/JumpWindow";
import changeWebTitle from "../../utils/changeWebTitle";
import Loading from "../../components/Loading";
import useUnSavedChange from "../../hooks/useUnsavedChange";
import HeadshotEditor from "../../components/User/HeadshotEditor";

import {
  userPageReducer,
  userPageStateDef,
} from "../../data/reducer/userPageReducer";
import { htmlReg } from "../../utils/regexHelper";
import PageNav from "../../components/PageNav";
import { artworkParmas } from "../../utils/parmasHelper";
import { userDataActions } from "../../data/reduxModels/userDataRedux";

enum displayArtworkEnum {
  illustration,
  collection,
}

function User() {
  const loginData = useAppSelector((state) => state.userData);
  const reduxDispatch = useAppDispatch();
  const [reducer, reducerDispatch] = useReducer(
    userPageReducer,
    userPageStateDef
  );
  const [listType, setListType] = useState<displayArtworkEnum>(
    displayArtworkEnum.illustration
  );

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { followBtn, setIsFollow } = useFollowUser(
    reducer.userData ? reducer.userData.id : -1
  );
  const {
    setIsDirty,
    checkUnsaved,
    CheckUnsavedModal,
    CheckUnsavedToLeaveModal,
  } = useUnSavedChange();

  const artworkCount = 20;
  const maxNicknameLength = 15;

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) return navigate(path.home);

    reducerDispatch({ type: "setIsOwn", payload: false });
    axios
      .get(`/api/User/${id}`)
      .then((res) => {
        const data = res.data as userDataType;

        const _userData = userDataHelper(data);
        _userData.headshot = userHeadshotHelper(_userData.headshot);

        reducerDispatch({ type: "setUserData", payload: _userData });
        setIsFollow(_userData.isFollow);

        if (id && loginData.id === parseInt(id)) {
          reducerDispatch({ type: "setIsOwn", payload: true });
          reducerDispatch({
            type: "setUserPostDataFromUserData",
            payload: _userData,
          });
        }

        changeWebTitle(`${_userData.nickName} - `);
      })
      .catch(() => navigate("*"));
      
  }, []);
  useEffect(() => {
    const intReg = /^[0-9]+$/;
    if (searchParams.has(artworkParmas.page)) {
      const pageStr = searchParams.get(artworkParmas.page);
      if (pageStr && intReg.test(pageStr)) {
        reducerDispatch({ type: "setPage", payload: parseInt(pageStr) - 1 });
      }
    } else {
      reducerDispatch({ type: "setPage", payload: 0 });
    }
  }, [searchParams]);

  useEffect(() => {
    switch (listType) {
      case displayArtworkEnum.collection:
        axios
          .get("/api/Work/GetList/Like", {
            params: { page: reducer.page, workCount: artworkCount },
          })
          .then((res) => {
            const data = res.data as ArtworkListType;
            reducerDispatch({ type: "setArtworkList", payload: data });
          })
          .catch((err) => console.log(err));
        break;
      case displayArtworkEnum.illustration:
        axios
          .get(`/api/Work/GetList/Artist/${id}`, {
            params: { page: reducer.page, workCount: artworkCount },
          })
          .then((res) => {
            const data = res.data as ArtworkListType;
            reducerDispatch({ type: "setArtworkList", payload: data });
          })
          .catch((err) => console.log(err));
        break;
      default:
        return;
    }
  }, [listType, reducer.page]);

  const handleEditUserData = async () => {
    const copyPostData = Object.assign({}, reducer.userPostData);
    copyPostData.profile = copyPostData.profile.replace(htmlReg, "").trimEnd();
    copyPostData.nickName = copyPostData.nickName.replace(htmlReg, "").trim();
    reducerDispatch({ type: "setUserPostData", payload: copyPostData });
    const errFnc = () =>
      reducerDispatch({ type: "setIsEditNicknameErr", payload: true });

    if (copyPostData.nickName === "") return errFnc();

    reducerDispatch({ type: "setIsLoading", payload: true });

    await axios
      .post("/api/EditAccount/UserData", reducer.userPostData)
      .then((res) => {
        const data: boolean = res.data;
        if (!data) return errFnc();

        const copyUserData = Object.assign({}, reducer.userData);
        copyUserData.nickName = copyPostData.nickName;
        copyUserData.profile = copyPostData.profile;
        reducerDispatch({ type: "setUserData", payload: copyUserData });
        reduxDispatch(userDataActions.setUserData(copyUserData));

        setIsDirty(false);
        reducerDispatch({ type: "setIsEdit", payload: false });
      })
      .catch(() => alert("通訊錯誤，請稍後再試"));

    reducerDispatch({ type: "setIsLoading", payload: false });
  };
  const handleEditUserDataCnacel = () => {
    checkUnsaved(() => {
      if (reducer.userData)
        reducerDispatch({
          type: "setUserPostDataFromUserData",
          payload: reducer.userData,
        });
      reducerDispatch({ type: "setIsEdit", payload: false });
    });
  };

  const handleNicknameInput = (e: ChangeEvent) => {
    const value = e.target.value;
    if (value.trim().length > maxNicknameLength) return;

    const copyData = Object.assign({}, reducer.userPostData);
    copyData.nickName = value;
    reducerDispatch({
      type: "setUserPostData",
      payload: copyData,
    });

    reducerDispatch({
      type: "setIsEditNicknameErr",
      payload: value.trim().length === 0,
    });
    setIsDirty(value.trim() !== reducer.userData?.nickName);
  };
  const handleProfileInput = (e: ChangeTextareaEvent) => {
    const value = e.target.value;
    const copyData = Object.assign({}, reducer.userPostData);
    copyData.profile = value;
    reducerDispatch({
      type: "setUserPostData",
      payload: copyData,
    });
    setIsDirty(reducer.userData?.profile !== value.trimEnd());
  };

  return (
    <div className={style["body"]}>
      <div className={style["user-data"]}>
        <CoverEditor
          imgUrl={reducer.userData ? reducer.userData.cover : ""}
          isOwn={reducer.isOwn}
        />
        <div className={style["info-base"]}>
          <div className={style["info-nav"]}>
            <div className={style["start"]}>
              <div className={style["headshot"]}>
                <HeadshotEditor
                  headshotUrl={
                    reducer.userData ? reducer.userData.headshot : ""
                  }
                  isOwn={reducer.isOwn}
                  offsetY="-20%"
                />
              </div>
            </div>
            <div className={style["middle"]}>
              <div className={style["name"]}>{reducer.userData?.nickName}</div>
              <div className={style["following-count"]}>
                {reducer.userData?.followingCount}
                <span className={style["sub"]}>關注中</span>
              </div>

              <div className={style["profile"]}>
                <div className={style["content"]}>
                  {reducer.userData?.profile}
                </div>

                <button
                  type="button"
                  name="moreUserInfo"
                  className={style["more-btn"]}
                  onClick={() =>
                    reducerDispatch({ type: "setIsShowDetail", payload: true })
                  }
                >
                  更多個人資訊
                </button>
              </div>
            </div>
            <div className={style["end"]}>
              <div className={style[reducer.isOwn ? "edit-btn" : "btn"]}>
                {reducer.isOwn ? (
                  <NormalBtn
                    text="編輯個人資料"
                    onClick={() =>
                      reducerDispatch({ type: "setIsEdit", payload: true })
                    }
                  />
                ) : (
                  followBtn
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {reducer.isEdit && (
        <JumpWindow closeFnc={handleEditUserDataCnacel}>
          <>
            <div className={style["edit-window"]}>
              <h1 className={style["window-title"]}>編輯個人資料</h1>
              <div className={style["edit-container"]}>
                <div className={style["item"]}>
                  <div className={style["title"]}>暱稱</div>
                  <div
                    className={
                      style["input"] +
                      (reducer.isEditNicknameErr ? " " + style["err"] : "")
                    }
                  >
                    <input
                      type="text"
                      name="nickname"
                      className={style["text"]}
                      value={reducer.userPostData.nickName}
                      onChange={handleNicknameInput}
                    />
                    <span className={style["tip"]}>
                      {reducer.userPostData.nickName.length +
                        "/" +
                        maxNicknameLength}
                    </span>
                  </div>
                  {reducer.isEditNicknameErr && (
                    <p className={style["err-text"]}>請輸入暱稱</p>
                  )}
                </div>
                <div className={style["item"]}>
                  <div className={style["title"]}>自我介紹</div>
                  <div className={style["input"]}>
                    <textarea
                      className={style["textarea"]}
                      rows={5}
                      name="profile"
                      value={reducer.userPostData.profile}
                      onChange={handleProfileInput}
                    />
                  </div>
                </div>
              </div>
              <div className={style["btn-container"]}>
                <div className={style["btn"]}>
                  <SureBtn
                    text="確定"
                    onClick={handleEditUserData}
                    disabled={reducer.userPostData.nickName.trim().length === 0}
                  />
                </div>
                <div className={style["btn"]}>
                  <NormalBtn text="取消" onClick={handleEditUserDataCnacel} />
                </div>
              </div>
            </div>
            {CheckUnsavedModal}
            {CheckUnsavedToLeaveModal}
          </>
        </JumpWindow>
      )}
      {reducer.isShowDetail && (
        <JumpWindow
          closeFnc={() =>
            reducerDispatch({ type: "setIsShowDetail", payload: false })
          }
        >
          <>
            <div className={style["detail-data"] + " " + style["header"]}>
              <div className={style["user"]}>
                <div className={style["headshot"]}>
                  <img src={reducer.userData?.headshot} alt="headshot" />
                </div>
                <div className={style["name"]}>
                  {reducer.userData?.nickName}
                </div>
                <div className={style["follow-btn"]}>
                  {!reducer.isOwn && followBtn}
                </div>
              </div>
            </div>
            <div className={style["detail-data"] + " " + style["content"]}>
              <div className={style["profile"]}>
                {reducer.userData?.profile}
              </div>
            </div>
          </>
        </JumpWindow>
      )}
      {reducer.isLoading && <Loading />}
      <div className={style["artwork-container"]}>
        <div className={style["bookmark-nav"]}>
          <label
            className={
              style["btn"] +
              (listType === displayArtworkEnum.illustration
                ? " " + style["active"]
                : "")
            }
          >
            <input
              type="radio"
              name="disListType"
              className={style["radio"]}
              onChange={(e: ChangeEvent) => {
                e.preventDefault();
                setListType(parseInt(e.target.value));
              }}
              value={displayArtworkEnum.illustration}
            />
            插畫
          </label>
          <label
            className={
              style["btn"] +
              (listType === displayArtworkEnum.collection
                ? " " + style["active"]
                : "")
            }
          >
            <input
              type="radio"
              name="disListType"
              className={style["radio"]}
              onChange={(e: ChangeEvent) => {
                e.preventDefault();
                setListType(parseInt(e.target.value));
              }}
              value={displayArtworkEnum.collection}
            />
            收藏
          </label>
          <span className={style["artwork-count"]}>
            {reducer.artworkList.maxCount}
          </span>
        </div>
        <div className={style["list-container"]}>
          <ArtworkListContainer
            list={reducer.artworkList.artworkList}
            showArtTitle
          />
          <PageNav
            max={reducer.artworkList.maxCount}
            pageCount={artworkCount}
          />
        </div>
      </div>
    </div>
  );
}
export default User;
