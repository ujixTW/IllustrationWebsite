import style from "../../assets/CSS/components/artwork/ArtworkCard.module.css";
import path from "../../data/JSON/path.json";
import { memo } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { Link } from "react-router-dom";
import ArtworkImgCard from "./ArtworkImgCard";
import ArtistNametabe from "../ArtistCard/ArtistNametabe";

function ArtworkCard(props: {
  artwork: ArtworkType;
  showArtTitle?: boolean;
  showArtistData?: boolean;
  length?: number;
}) {
  const length = props.length != undefined ? `${props.length}px` : "184px";

  return (
    <div className={style["card"]}>
      <div
        className={style["artwork-box"]}
        style={{ height: length, width: length }}
      >
        <ArtworkImgCard artwork={props.artwork} />
      </div>

      <div className={style["data"]}>
        {props.showArtTitle && (
          <Link
            className={style["link"] + " " + style["title"]}
            to={`${(path.artworks.artwork + props.artwork.id) as string}`}
          >
            {props.artwork.title}
          </Link>
        )}
        {props.showArtistData && (
          <ArtistNametabe
            Id={props.artwork.artistId}
            headshot={props.artwork.artistHeadshotContent}
            name={props.artwork.artistName}
          />
        )}
      </div>
    </div>
  );
}
export default memo(ArtworkCard);
