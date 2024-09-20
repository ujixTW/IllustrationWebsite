import style from "../../assets/CSS/components/artwork/ArtworkCard.module.css";
import path from "../../data/JSON/path.json";
import { memo } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { Link } from "react-router-dom";
import LikeBtn from "../Button/LikeBtn";
import { ImagePathHelper } from "../../utils/ImagePathHelper";

function ArtworkImgCard(props: { artwork: ArtworkType }) {
  const { artwork } = props;

  return (
    <div className={style["artwork-block"]}>
      <Link
        className={style["link"]}
        to={`${(path.artworks.artwork + artwork.id) as string}`}
      >
        <img
          className={style["artwork"]}
          src={ImagePathHelper(artwork.coverImg)}
          alt={artwork.title}
        />
      </Link>
      <div className={style["like"]}>
        <LikeBtn artworkId={artwork.id} likeOrigin={artwork.isLike} />
      </div>
    </div>
  );
}
export default memo(ArtworkImgCard);
