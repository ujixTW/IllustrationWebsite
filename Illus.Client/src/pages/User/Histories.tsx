import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/User/Histories.module.css";
import path from "../../data/JSON/path.json";
import { useAppSelector } from "../../hooks/redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArtworkListType } from "../../data/typeModels/artwork";
import axios from "axios";
import changeWebTitle from "../../utils/changeWebTitle";
import PageNav from "../../components/PageNav";
import ArtworkListContainer from "../../components/artwork/ArtworkListContainer";
import { artworkParmas, descReg } from "../../utils/parmasHelper";
import ArtworksFilter from "../../components/artwork/ArtworksFilter";

function Histories() {
  const isLogin = useAppSelector((state) => state.login);
  const [artworkArr, setArtworkArr] = useState<ArtworkListType>({
    artworkList: [],
    dailyTheme: "",
    maxCount: 0,
  });

  const navigate = useNavigate();
  const [searchParmas] = useSearchParams();
  const pageCount = 30;

  useEffect(() => {
    if (!isLogin) return navigate(path.home);

    changeWebTitle("瀏覽紀錄 - ");
  }, []);

  useEffect(() => {
    let [page, _isDesc] = [0, false];
    const [pageStr, isDescStr] = [
      searchParmas.get(artworkParmas.page),
      searchParmas.get(artworkParmas.order),
    ];

    if (pageStr && /^\d+$/.test(pageStr)) page = parseInt(pageStr);
    _isDesc = isDescStr !== null && descReg.test(isDescStr);

    axios
      .get("/api/Work/GetList/History", {
        params: { page: page, isDesc: _isDesc, workCount: pageCount },
      })
      .then((res) => {
        const data = res.data as ArtworkListType;
        setArtworkArr(data);
      })
      .catch((err) => console.log(err));
  }, [searchParmas]);

  return (
    <div className={style["body"]}>
      <ArtworksFilter orderTime />
      <ArtworkListContainer showArtistData list={artworkArr.artworkList} />
      <PageNav max={artworkArr.maxCount} pageCount={pageCount} />
    </div>
  );
}

export default Histories;
