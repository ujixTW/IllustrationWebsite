import style from "../../assets/CSS/components/artwork/ArtworkCard.module.css";
import path from "../../data/JSON/path.json";
import { memo } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { Link } from "react-router-dom";
import ArtworkImgCard from "./ArtworkImgCard";
import ArtistNametabe from "../ArtistCard/ArtistNametabe";
import { userHeadshotHelper } from "../../utils/fromBackEndDataHelper";

function ArtworkCard(props: {
  artwork: ArtworkType;
  showArtTitle?: boolean;
  showArtistData?: boolean;
  length?: number;
  isOwn?: boolean;
}) {
  const { artwork, showArtTitle, showArtistData, length } = props;
  const imgLength = length != undefined ? `${length}px` : "184px";

  return (
    <div className={style["card"]}>
      <div
        className={style["artwork-box"]}
        style={{ height: imgLength, width: imgLength }}
      >
        <ArtworkImgCard artwork={artwork} isOwn={props.isOwn} />
      </div>

      <div className={style["data"]}>
        {showArtTitle && (
          <Link
            className={style["link"] + " " + style["title"]}
            to={`${(path.artworks.artwork + artwork.id) as string}`}
          >
            {artwork.title}
          </Link>
        )}
        {showArtistData && (
          <ArtistNametabe
            Id={artwork.artistId}
            headshot={userHeadshotHelper(artwork.artistHeadshotContent)}
            name={artwork.artistName}
          />
        )}
      </div>
    </div>
  );
}
export default memo(ArtworkCard);
