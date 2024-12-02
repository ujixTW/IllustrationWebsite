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
  payload: ArtworkType[];
}
interface pageMaxAction {
  type: ActionType;
  payload: boolean;
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
  const { type, payload } = action;
  const stateCopy = Object.assign({}, state);
  switch (type) {
    case ActionType.FOLLOW:
      stateCopy.follow = [...payload];
      return stateCopy;
    case ActionType.DAILY:
      stateCopy.daily = [...payload];
      return stateCopy;
    case ActionType.HOT:
      stateCopy.hot = [...payload];
      return stateCopy;
    default:
      return state;
  }
};
const pageMaxReducer = function (state: pageMaxState, action: pageMaxAction) {
  const copyState = Object.assign({}, state);
  switch (action.type) {
    case ActionType.FOLLOW:
      copyState.follow = action.payload;
      return copyState;
    case ActionType.HOT:
      copyState.hot = action.payload;
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
            payload: fData.artworkList,
          });
          artworkListDispatch({
            type: ActionType.DAILY,
            payload: dData.artworkList,
          });
          artworkListDispatch({
            type: ActionType.HOT,
            payload: hData.artworkList,
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
        const originArr: ArtworkType[] = [];
        switch (actType) {
          case ActionType.DAILY:
            originArr.push(...artworkList.daily);
            break;
          case ActionType.FOLLOW:
            originArr.push(...artworkList.follow);
            break;
          case ActionType.HOT:
            originArr.push(...artworkList.hot);
            break;
          default:
            break;
        }
        artworkListDispatch({
          type: actType,
          payload: originArr.concat(data.artworkList),
        });
        if (data.maxCount <= oldList.length + data.artworkList.length)
          pageMaxDispatch({ payload: true, type: actType });
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
      <ArtworksFilter switchAI switchR18 />
      {artworkList.follow.length > 0 && (
        <div className={style["follow"]}>
          <ArtworkBarListContainer
            title="已追隨使用者的作品"
            list={artworkList.follow}
            link={path.artworks.followingList}
            getMoreDataFnc={!pageMax ? handleFollowList : undefined}
            showArtTitle
            showArtistData
          />
        </div>
      )}

      {artworkList.daily.length > 0 && (
        <div className={style["daily"]}>
          <ArtworkListContainer
            title={`${dailyTheme}主題日!`}
            list={artworkList.daily}
            link={(path.artworks.list, { search: `?keywords=${dailyTheme}` })}
            showArtTitle
            showArtistData
          />
        </div>
      )}
      <div className={style["hot"]}>
        <ArtworkListContainer
          title="熱門作品"
          list={artworkList.hot}
          getMoreDataFnc={!pageMax ? handleHotList : undefined}
          showArtTitle
          showArtistData
        />
      </div>
    </div>
  );
}

export default HomeAfterLogin;
