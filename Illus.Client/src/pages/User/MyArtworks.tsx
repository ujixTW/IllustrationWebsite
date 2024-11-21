import { Link, useNavigate, useSearchParams } from "react-router-dom";
import style from "../../assets/CSS/pages/User/MyArtworks.module.css";
import path from "../../data/JSON/path.json";
import EditSvg from "../../assets/SVG/edit.svg?react";
import FilterSvg from "../../assets/SVG/filter.svg?react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArtworkListType, ArtworkType } from "../../data/typeModels/artwork";
import { useAppSelector } from "../../hooks/redux";
import PageNav from "../../components/PageNav";
import { artworkParmas, descReg, r18Reg } from "../../utils/parmasHelper";
import ArtworksFilter from "../../components/artwork/ArtworksFilter";
import CollapsibleField from "../../components/CollapsibleField";
import changeWebTitle from "../../utils/changeWebTitle";
import ArtworkImgCard from "../../components/artwork/ArtworkImgCard";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import { artworkOrderType } from "../../data/postData/artwork";
import { fromBackEndArtworkListDataHelper } from "../../utils/fromBackEndDataHelper";

function ArtworkBar(props: { artwork: ArtworkType }) {
  const { artwork } = props;
  return (
    <div className={style["artwork"] + " " + style["row"]}>
      {/* 封面 */}
      <div className={style["col-start"]}>
        <div className={style["cover"]}>
          <ArtworkImgCard artwork={artwork} isOwn />
        </div>
      </div>
      {/* 標題 & 編輯選項 */}
      <div className={style["col"] + " " + style["flex"]}>
        <div className={style["text"]}>{artwork.title}</div>
        <div className={style["end"]}>
          <Link to={path.artworks.artwork + artwork.id + path.artworks.edit}>
            <EditSvg className={style["svg"]} />
          </Link>
        </div>
      </div>
      {/* 讚 */}
      <div className={style["col"]}>{artwork.likeCount}</div>
      {/* 瀏覽量 */}
      <div className={style["col"]}>{artwork.readCount}</div>
      {/* 日期 */}
      <div className={style["col"]}>
        {artwork.postTime.getFullYear()}年{artwork.postTime.getMonth() + 1}月
        {artwork.postTime.getDate()}日
      </div>
      {/* 是否為限制級 */}
      <div className={style["col"]}>{artwork.isR18 ? "限制級" : "-"}</div>
    </div>
  );
}

function MyArtworks() {
  const isLogin = useAppSelector((state) => state.login);
  const userId = useAppSelector((state) => state.userData.id);
  const [artworkArr, setArtworkArr] = useState<ArtworkListType>({
    artworkList: [],
    maxCount: 0,
    dailyTheme: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const [searchParmas] = useSearchParams();
  const navigate = useNavigate();
  const pageCount = 20;

  useEffect(() => {
    if (!isLogin) return navigate(path.home);

    const pageStr = searchParmas.get(artworkParmas.page);
    const isR18Str = searchParmas.get(artworkParmas.r18);
    const orderStr = searchParmas.get(artworkParmas.order);
    const page = pageStr && parseInt(pageStr) ? parseInt(pageStr) : 0;
    const order =
      orderStr !== null && /hot/.test(orderStr)
        ? artworkOrderType.hot
        : artworkOrderType.postTime;

    changeWebTitle("已投稿的作品 - ");

    axios
      .get(`/api/Work/GetList/Artist/${userId}`, {
        params: {
          page: page,
          workCount: pageCount,
          isDesc: orderStr !== null && descReg.test(orderStr),
          orderType: order,
          isR18: isR18Str !== null && r18Reg.test(isR18Str),
        },
      })
      .then((res) => {
        const data = fromBackEndArtworkListDataHelper(
          res.data as ArtworkListType
        );

        setArtworkArr(data);
      })
      .catch((err) => console.log(err));
  }, [searchParmas]);

  const list = artworkArr.artworkList.map((item) => (
    <div key={item.id}>
      <ArtworkBar artwork={item} />
    </div>
  ));

  return (
    <div className={style["body"]}>
      <div className={style["navbar"]}>
        <div className={style["start"]}>
          <h1 className={style["title"]}>
            作品<div className={style["tip"]}>{artworkArr.maxCount}</div>
          </h1>
        </div>
        <div className={style["end"]}>
          <label className={style["switch"]}>
            <input
              type="checkbox"
              name="showFilter"
              onChange={(e: ChangeEvent) => setShowFilter(e.target.checked)}
              checked={showFilter}
              className={style["input"]}
            />
            <div className={style["btn"]}>
              <FilterSvg className={style["svg"]} />
              <span>篩選</span>
            </div>
          </label>
        </div>
      </div>
      <CollapsibleField isShow={showFilter} baseHeight={0}>
        <ArtworksFilter hasOrder switchR18 />
      </CollapsibleField>
      <div className={style["artwork-bar-container"]}>
        <div className={style["row"] + " " + style["title"]}>
          <div className={style["col-start"]}></div>
          {/* 標題 & 編輯選項 */}
          <div className={style["col"]}>標題</div>
          {/* 讚 */}
          <div className={style["col"]}>讚!</div>
          {/* 瀏覽量 */}
          <div className={style["col"]}>瀏覽量</div>
          {/* 日期 */}
          <div className={style["col"]}>日期</div>
          {/* 是否為限制級 */}
          <div className={style["col"]}>分級</div>
        </div>
        {list}
      </div>
      <PageNav max={artworkArr.maxCount} pageCount={pageCount} />
    </div>
  );
}

export default MyArtworks;
