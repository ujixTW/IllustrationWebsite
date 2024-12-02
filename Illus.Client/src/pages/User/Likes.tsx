import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/User/Likes.module.css";
import path from "../../data/JSON/path.json";
import { useAppSelector } from "../../hooks/redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArtworkListType } from "../../data/typeModels/artwork";
import changeWebTitle from "../../utils/changeWebTitle";
import ArtworkListContainer from "../../components/artwork/ArtworkListContainer";
import PageNav from "../../components/PageNav";
import { artworkParmas } from "../../utils/parmasHelper";
import axios from "axios";

function Likes() {
  const isLogin = useAppSelector((state) => state.login);
  const [artworkArr, setArtworkArr] = useState<ArtworkListType>({
    artworkList: [],
    dailyTheme: "",
    maxCount: 0,
  });

  const [searchParmas] = useSearchParams();
  const navigate = useNavigate();
  const pageCount = 30;

  useEffect(() => {
    if (!isLogin) return navigate(path.home);

    changeWebTitle("收藏 - ");
  }, []);

  useEffect(() => {
    let page = 0;
    const pageStr = searchParmas.get(artworkParmas.page);

    if (pageStr && /^\d+$/.test(pageStr)) page = parseInt(pageStr);

    axios
      .get("/api/Work/GetList/Like", {
        params: { page: page, workCount: pageCount },
      })
      .then((res) => {
        const data = res.data as ArtworkListType;
        setArtworkArr(data);
      })
      .catch((err) => console.log(err));
  }, [searchParmas]);

  return (
    <div className={style["body"]}>
      <h1>收藏作品</h1>
      <ArtworkListContainer
        list={artworkArr.artworkList}
        showArtistData
        showArtTitle
      />
      <PageNav max={artworkArr.maxCount} pageCount={pageCount} />
    </div>
  );
}

export default Likes;
