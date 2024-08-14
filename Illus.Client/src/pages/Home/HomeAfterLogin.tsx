import {
  ArtworkListType,
  ArtworkListTypeData,
  ArtworkType,
} from "../../data/typeModels/artwork";
import style from "../../assets/CSS/pages/Home.module.css";
import { useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import CheckBtn from "../../components/CheckBtn";
import ArtworkCard from "../../components/artwork/ArtworkCard";
import { asyncDebounce } from "../../utils/debounce";
import { Link } from "react-router-dom";
import path from "../../data/JSON/path.json";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { artworkCateActions } from "../../data/reduxModels/artworkCateRedux";
import ArtworkBarList from "../../components/artwork/ArtworkBarList";
import ArtworkList from "../../components/artwork/ArtworkList";

interface ArtworkListAction {
  type: ArtworkListTypeData;
  list: ArtworkType[];
}
interface ArtworkListState {
  hot: ArtworkType[];
  daily: ArtworkType[];
  follow: ArtworkType[];
}

const artworkListReducer = function (
  state: ArtworkListState,
  action: ArtworkListAction
) {
  const { type, list } = action;
  const stateCopy = Object.assign({}, state);
  switch (type) {
    case ArtworkListTypeData.HOT:
      stateCopy.hot.push(...list);
      return stateCopy;
    case ArtworkListTypeData.FOLLOW:
      stateCopy.follow.push(...list);
      return stateCopy;
    case ArtworkListTypeData.DAILY:
      stateCopy.daily.push(...list);
      return stateCopy;
    default:
      return state;
  }
};

function HomeAfterLogin() {
  const [artworkList, setArtworkList] = useReducer(artworkListReducer, {
    follow: [],
    daily: [],
    hot: [],
  });
  const dispatch = useAppDispatch();
  const isR18 = useAppSelector((state) => state.artworkCate.isR18);
  const isAI = useAppSelector((state) => state.artworkCate.isAI);
  const [dailyTheme, setDailyTheme] = useState<string>("");
  const artworkPCount: number = 15;
  const r18Handler = () => dispatch(artworkCateActions.switchR18());
  const aiHandler = () => dispatch(artworkCateActions.switchAI());

  useEffect(
    asyncDebounce(() => {
      // 呼叫順序:關注>每日>推薦>最新(使用者下滑一定距離後)
      axios
        .get("/api/Work/GetList/Home", {
          params: { isAI: isAI, isR18: isR18, workCount: artworkPCount },
        })
        .then((res) => {
          const data: ArtworkListType[] = res.data as ArtworkListType[];
          data.forEach((list) => {
            if (list.dailyTheme != "") setDailyTheme(list.dailyTheme);
            setArtworkList({
              type: list.type,
              list: list.artworkList,
            });
          });
        })
        .catch((err) => console.log(err));
    }),
    [isR18, isAI]
  );

  const followArtworkArr = useMemo(() => {
    return artworkList.follow.map((artwork: ArtworkType) => [
      <ArtworkCard artwork={artwork} />,
    ]);
  }, []);
  const dailyArtworkArr = useMemo(() => {
    return artworkList.daily.map((artwork: ArtworkType) => [
      <ArtworkCard artwork={artwork} />,
    ]);
  }, []);
  const popArtworkArr = useMemo(() => {
    return artworkList.hot.map((artwork: ArtworkType) => [
      <ArtworkCard artwork={artwork} />,
    ]);
  }, []);

  return (
    <div className={style["after"]}>
      <div className={style["option-bar"]}>
        <div>
          <CheckBtn
            name="isAI"
            text="AI"
            onChange={aiHandler}
            checked={isAI}
            hasBackground={false}
          />
        </div>
        <div>
          <CheckBtn
            name="isR18"
            text="R-18"
            onChange={r18Handler}
            checked={isR18}
            hasBackground={false}
          />
        </div>
      </div>
      <div className={style["follow"]}>
        <div className={style["title"]}>
          <div>已關注用戶的作品</div>
          <Link to={path.artworks.followingList} className={style["more"]}>
            查看更多
          </Link>
        </div>
        <div className={style["list"]}>
          <div className={style["back"]}></div>
          <div>{followArtworkArr}</div>
          <div className={style["next"]}></div>
        </div>
      </div>

      {dailyArtworkArr.length > 0 && (
        <div className={style["daily"]}>
          <div className={style["title"]}>{dailyTheme}主題日!</div>
          <div className={style["list"]}>{dailyArtworkArr}</div>
        </div>
      )}
      <div className={style["pop"]}>
        <div className={style["title"]}></div>
        <div className={style["list"]}>{popArtworkArr}</div>
      </div>
    </div>
  );
}

export default HomeAfterLogin;
