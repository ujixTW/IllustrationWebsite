import style from "../../assets/CSS/pages/Artwork/ArtworkList.module.css";
import path from "../../data/JSON/path.json";
import { useEffect, useState } from "react";
import changeWebTitle from "../../utils/changeWebTitle";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArtworkListType, ArtworkType } from "../../data/typeModels/artwork";
import { artworkOrderType } from "../../data/postData/artwork";
import {
  keywordReg,
  pageReg,
  orderReg,
  descReg,
  r18Reg,
  AIReg,
  artworkParmas,
} from "../../utils/parmasHelper";
import PageNav from "../../components/PageNav";
import ArtworkListContainer from "../../components/artwork/ArtworkListContainer";
import ArtworksFilter from "../../components/artwork/ArtworksFilter";
import { useAppSelector } from "../../hooks/redux";
import { htmlReg } from "../../utils/regexHelper";

function ArtworkList(props: { isFollowing?: boolean }) {
  const isLogin = useAppSelector((state) => state.login);
  const [list, setList] = useState<ArtworkType[]>([]);
  const [maxCount, setMaxCount] = useState<number>(0);
  const [title, setTitle] = useState("");
  const pageCount = 30;
  const [searchParmas] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const search = location.search;

    if (!props.isFollowing) {
      if (!keywordReg.test(search)) return navigate(path.home);
      let [keyword, page, desc, r18, AI, order] = [
        "",
        0,
        false,
        false,
        false,
        artworkOrderType.postTime,
      ];
      keyword = search
        .match(keywordReg)![0]
        .split("=")[1]
        .replace(/[+]+/g, " ");
      if (pageReg.test(search))
        page = parseInt(search.match(pageReg)![0].split("=")[1]);
      if (orderReg.test(search)) {
        const tempStr = search.match(orderReg);
        if (tempStr != null) {
          desc = descReg.test(tempStr[0]);
          if (/hot/.test(tempStr[0])) order = artworkOrderType.hot;
        }
      }

      r18 = r18Reg.test(search);
      AI = AIReg.test(search);

      axios
        .get("/api/Work/GetList", {
          params: {
            page: page - 1,
            keywords: keyword,
            isDesc: desc,
            orderType: order,
            isR18: r18,
            isAI: AI,
            workCount: pageCount,
          },
        })
        .then((res) => {
          const data: ArtworkListType = res.data;
          const _keyword = decodeURI(keyword).replace(htmlReg, "");

          setList(data.artworkList);
          setMaxCount(data.maxCount);
          const titleArtworkCount =
            data.maxCount > 100000
              ? "投稿超過10萬件"
              : `${data.maxCount}件投稿`;
          setTitle(_keyword);
          changeWebTitle(`#${_keyword}的插畫作品(${titleArtworkCount}) - `);
        })
        .catch((err) => console.log(err));
    } else {
      if (!isLogin) return navigate(path.home);

      const pageStr = searchParmas.get(artworkParmas.page);
      const isR18 = searchParmas.get(artworkParmas.r18);
      axios
        .get("/api/Work/GetList/Following", {
          params: {
            page: pageStr && /^\d+$/.test(pageStr) ? parseInt(pageStr) : 0,
            isR18: isR18 !== null && r18Reg.test(isR18),
            workCount: pageCount,
          },
        })
        .then((res) => {
          const data = res.data as ArtworkListType;

          setList(data.artworkList);
          setMaxCount(data.maxCount);

          setTitle("已關注用戶的作品");
          changeWebTitle("已關注用戶的作品 - ");
        })
        .catch((err) => console.log(err));
    }
  }, [searchParmas]);

  return (
    <div className={style["body"]}>
      <h1 className={style["title"]}>{title}</h1>
      <ArtworksFilter hasOrder switchR18 switchAI={!props.isFollowing} />
      <div className={style["list"]}>
        <ArtworkListContainer list={list} showArtTitle showArtistData />
      </div>
      <PageNav max={maxCount} pageCount={pageCount} />
    </div>
  );
}
export default ArtworkList;
