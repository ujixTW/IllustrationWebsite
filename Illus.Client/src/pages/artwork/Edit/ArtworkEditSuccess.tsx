import { useLocation, useNavigate } from "react-router-dom";
import style from "../../../assets/CSS/pages/Artwork/Edit/ArtworkEditSuccess.module.css";
import path from "../../../data/JSON/path.json";
import { useEffect, useState } from "react";
import { ArtworkPostData } from "../../../data/postData/artwork";
import changeWebTitle from "../../../utils/changeWebTitle";
import { useAppSelector } from "../../../hooks/redux";
import LinkBtn from "../../../components/Button/LinkBtn";

interface LocationState {
  isCreate: boolean;
  artworkData: ArtworkPostData;
}

function ArtworlEditSuccess() {
  const isLogin = useAppSelector((state) => state.login);
  const [imgStr, setImgStr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    if (state === null || state.artworkData === null || !isLogin)
      return navigate(path.home);

    changeWebTitle(state.isCreate ? "投稿成功 - " : "編輯成功 - ");
    setImgStr(URL.createObjectURL(state.artworkData.imgs[0]));

    return () => {
      URL.revokeObjectURL(imgStr);
    };
  }, []);

  return (
    <div className={style["body"]}>
      <div className={style["content"]}>
        <div className={style["artwork-container"]}>
          <img src={imgStr} alt="artwork" className={style["artwork"]} />
        </div>
        <div className={style["data-container"]}>
          <h3>{state.artworkData.title}</h3>
          <h1 className={style["success-message"]}>
            {state.isCreate ? "投稿成功!" : "修改完成!"}
          </h1>
          <div className={style["sure-btn"]}>
            <LinkBtn
              text="確定"
              link={
                state.isCreate
                  ? path.home
                  : path.artworks.artwork + state.artworkData.id
              }
              color="main-blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ArtworlEditSuccess;
