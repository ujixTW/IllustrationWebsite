import style from "../assets/CSS/pages/Home.module.css";
import path from "../data/JSON/path.json";
import IconLong from "../assets/IconLong.svg?react";
import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { IsLoginContext } from "../context/LoginContext";
import BeforeLoginLayOut from "../layouts/BeforeLoginLayout";
import { Link } from "react-router-dom";
import { ArtworkListType, ArtworkType } from "../data/typeModels/artwork";
import axios from "axios";
import ArtworkCard from "../components/artworkList/ArtworkCard";
import { testArtwork } from "../data/testData";
import CheckBtn from "../components/CheckBtn";

enum ArtworkListActionKind {
  FOLLOW = "FOLLOW",
  DAILY = "DAILY",
  RECOMMEND = "RECOMMEND",
}
interface ArtworkListAction {
  type: ArtworkListActionKind;
  list: ArtworkType[];
}
interface ArtworkListState {
  follow: ArtworkType[];
  daily: ArtworkType[];
  recommend: ArtworkType[];
}

const artworkListReducer = function (
  state: ArtworkListState,
  action: ArtworkListAction
) {
  const { type, list } = action;
  const stateCopy = Object.assign({}, state);
  switch (type) {
    case ArtworkListActionKind.DAILY:
      stateCopy.daily.push(...list);
      break;
    case ArtworkListActionKind.FOLLOW:
      stateCopy.follow.push(...list);
      break;
    case ArtworkListActionKind.RECOMMEND:
      stateCopy.recommend.push(...list);
      break;
    default:
      break;
  }
  return stateCopy;
};
function AfterLogin() {
  const [artworkList, setArtworkList] = useReducer(artworkListReducer, {
    follow: [],
    daily: [],
    recommend: [],
  });
  const [isR18, setIsR18] = useState<boolean>(false);
  const [isAI, setIsAI] = useState<boolean>(false);
  const [dailyTheme, setDailyTheme] = useState<string>("");
  const artworkPCount: number = 16;

const test=useMemo(()=><ArtworkCard artwork={testArtwork} />,[]);

  useEffect(() => {
    // 呼叫順序:關注>每日>推薦>最新(使用者下滑一定距離後)
    // axios
    //   .get("/api/Work/GetList/Following", {
    //     params: { page: 0, isR18: isR18, workCount: artworkPCount },
    //   })
    //   .then((res) => {
    //     const data: ArtworkListType = res.data as ArtworkListType;
    //     setArtworkList({
    //       type: ArtworkListActionKind.FOLLOW,
    //       list: data.artworkList,
    //     });
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get("/api/Work/GetList/Daily", {
    //     params: { page: 0, isR18: isR18, isAI: isAI, workCount: artworkPCount },
    //   })
    //   .then((res) => {
    //     const data: ArtworkListType = res.data as ArtworkListType;
    //     setArtworkList({
    //       type: ArtworkListActionKind.DAILY,
    //       list: data.artworkList,
    //     });
    //     setDailyTheme(data.dailyTheme);
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get("/api/Work/GetList", {
    //     params: { page: 0, isR18: isR18, isAI: isAI, workCount: artworkPCount },
    //   })
    //   .then((res) => {
    //     const data: ArtworkListType = res.data as ArtworkListType;
    //     setArtworkList({
    //       type: ArtworkListActionKind.RECOMMEND,
    //       list: data.artworkList,
    //     });
    //   })
    //   .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    console.log("ai:"+isAI);
  }, [isAI]);
  useEffect(() => {
    console.log("r18:"+isR18);
  }, [isR18]);

  return (
    <div className={style["after"]}>
      <div className={style["option-bar"]}>
        <CheckBtn
          name="isAI"
          text="AI"
          onChange={() => setIsAI(!isAI)}
          checked={isAI}
          hasBackground={false}
        />
        <CheckBtn
          name="isR18"
          text="R-18"
          onChange={() => setIsR18(!isR18)}
          checked={isR18}
          hasBackground={false}
        />
      </div>
      <div className={style["list"]}>
        {test}
      </div>
      <div className={style["list"]}></div>
      <div className={style["list"]}></div>
    </div>
  );
}
function BeforeLogin() {
  const Context = () => (
    <div className={style["before"]}>
      <div>
        <IconLong className={style["logo"]} />
      </div>
      <div className={style["item"]}>
        <Link
          to={path.login.login}
          className={style["btn"] + " " + style["login"]}
        >
          登入
        </Link>
      </div>
      <div className={style["item"]}>
        <Link to={path.signUp.signUp} className={style["btn"]}>
          註冊
        </Link>
      </div>
    </div>
  );
  return <BeforeLoginLayOut context={<Context />} />;
}

function Home() {
  const { isLogin } = useContext(IsLoginContext);

  return isLogin ? <AfterLogin /> : <BeforeLogin />;
}

export default Home;
