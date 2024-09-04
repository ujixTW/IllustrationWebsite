import { ArtworkListType, ArtworkType } from "../../data/typeModels/artwork";
import style from "../../assets/CSS/pages/Home.module.css";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { asyncDebounce } from "../../utils/debounce";
import path from "../../data/JSON/path.json";
import ArtworkBarListContainer from "../../components/artwork/ArtworkBarListContainer";
import ArtworkListContainer from "../../components/artwork/ArtworkListContainer";
import ArtworksFilter from "../../components/artwork/ArtworksFilter";
import { useLocation } from "react-router-dom";
import { AIReg, r18Reg } from "../../utils/parmasHelper";

enum ActionType {
  FOLLOW = 0,
  DAILY = 1,
  HOT = 2,
}

interface ArtworkListAction {
  type: ActionType;
  isAdd: boolean;
  list: ArtworkType[];
}
interface pageMaxAction {
  type: ActionType;
  state: boolean;
}
interface ArtworkListState {
  hot: ArtworkType[];
  daily: ArtworkType[];
  follow: ArtworkType[];
}
interface pageMaxState {
  follow: boolean;
  hot: boolean;
}
const artworkListReducer = function (
  state: ArtworkListState,
  action: ArtworkListAction
) {
  const { type, isAdd, list } = action;
  const stateCopy = Object.assign({}, state);
  switch (type) {
    case ActionType.FOLLOW:
      if (isAdd) stateCopy.follow.push(...list);
      else stateCopy.follow = [...list];
      return stateCopy;
    case ActionType.DAILY:
      if (isAdd) stateCopy.daily.push(...list);
      else stateCopy.daily = [...list];
      return stateCopy;
    case ActionType.HOT:
      if (isAdd) stateCopy.hot.push(...list);
      else stateCopy.hot = [...list];
      return stateCopy;
    default:
      return state;
  }
};
const pageMaxReducer = function (state: pageMaxState, action: pageMaxAction) {
  const copyState = Object.assign({}, state);
  switch (action.type) {
    case ActionType.FOLLOW:
      copyState.follow = action.state;
      return copyState;
    case ActionType.HOT:
      copyState.hot = action.state;
      return copyState;
    default:
      return state;
  }
};
function HomeAfterLogin() {
  const [artworkList, artworkListDispatch] = useReducer(artworkListReducer, {
    follow: [],
    daily: [],
    hot: [],
  });
  const location = useLocation();
  const [isR18, setIsR18] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [dailyTheme, setDailyTheme] = useState<string>("");
  const artworkPCount: number = 15;

  const [pageMax, pageMaxDispatch] = useReducer(pageMaxReducer, {
    follow: false,
    hot: false,
  });

  useEffect(
    asyncDebounce(async () => {
      const [ai, r18] = [
        AIReg.test(location.search),
        r18Reg.test(location.search),
      ];
      // 呼叫順序:關注>每日>推薦
      const axiosArr = [
        axios.get("/api/Work/GetList/Following", {
          params: { isR18: r18, workCount: artworkPCount },
        }),
        axios.get("/api/Work/GetList/Daily", {
          params: { isR18: r18, isAI: ai, workCount: artworkPCount },
        }),
        axios.get("/api/Work/GetList", {
          params: { isR18: r18, isAI: ai, workCount: artworkPCount },
        }),
      ];
      await Promise.all(axiosArr)
        .then(([follow, daily, hot]) => {
          const [fData, dData, hData] = [
            follow.data,
            daily.data,
            hot.data,
          ] as ArtworkListType[];
          artworkListDispatch({
            type: ActionType.FOLLOW,
            isAdd: false,
            list: fData.artworkList,
          });
          artworkListDispatch({
            type: ActionType.DAILY,
            isAdd: false,
            list: dData.artworkList,
          });
          artworkListDispatch({
            type: ActionType.HOT,
            isAdd: false,
            list: hData.artworkList,
          });
          if (dData.artworkList.length > 0) setDailyTheme(dData.dailyTheme);

          setIsAI(ai);
          setIsR18(isR18);
        })
        .catch((err) => console.log(err));
    }),
    [location.search]
  );

  const handleGetMoreList = async (
    actType: ActionType,
    oldList: ArtworkType[],
    url: string
  ) => {
    await axios
      .get(url)
      .then((res) => {
        const data = res.data as ArtworkListType;
        artworkListDispatch({
          type: actType,
          isAdd: true,
          list: data.artworkList,
        });
        if (data.maxCount <= oldList.length + data.artworkList.length)
          pageMaxDispatch({ state: true, type: actType });
      })
      .catch((err) => console.log(err));
  };
  const handleFollowList = async () => {
    const page: number = artworkList.follow.length / artworkPCount;
    const url =
      "/api/Work/GetList/Following?" +
      `page=${page}&isR18=${isR18}&workCount=${artworkPCount}`;
    await handleGetMoreList(ActionType.FOLLOW, artworkList.follow, url);
  };
  const handleHotList = async () => {
    const page: number = artworkList.hot.length / artworkPCount;
    const url =
      "/api/Work/GetList?" +
      `page=${page}&isR18=${isR18}&isAI=${isAI}&workCount=${artworkPCount}`;
    await handleGetMoreList(page, artworkList.hot, url);
  };

  return (
    <div className={style["after"]}>
      <ArtworksFilter />
      {artworkList.follow.length > 0 && (
        <div className={style["follow"]}>
          <ArtworkBarListContainer
            title="已追隨使用者的作品"
            list={artworkList.follow}
            more
            link={path.artworks.followingList}
            getMoreDataFnc={!pageMax ? handleFollowList : undefined}
          />
        </div>
      )}

      {artworkList.daily.length > 0 && (
        <div className={style["daily"]}>
          <ArtworkListContainer
            title={`${dailyTheme}主題日!`}
            list={artworkList.daily}
            more
            link={(path.artworks.list, { search: `?keywords=${dailyTheme}` })}
          />
        </div>
      )}
      <div className={style["hot"]}>
        <ArtworkListContainer
          title="熱門作品"
          list={artworkList.hot}
          getMoreDataFnc={!pageMax ? handleHotList : undefined}
        />
      </div>
    </div>
  );
}

export default HomeAfterLogin;
