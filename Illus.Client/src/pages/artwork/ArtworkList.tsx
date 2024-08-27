import style from "../../assets/CSS/pages/Artwork/ArtworkList.module.css";
import path from "../../data/JSON/path.json";
import { useEffect } from "react";
import changeWebTitle from "../../utils/changeWebTitle";
import { useLocation, useNavigate } from "react-router-dom";

function ArtworkList() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const parmasStr = location.search.substring(1);
    if (parmasStr != "") {
      const params = parmasStr.split("&");
      
      changeWebTitle(``);
    } else {
      navigate(path.home);
    }
  }, []);
  return <></>;
}
export default ArtworkList;
