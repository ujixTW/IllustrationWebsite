import style from "../../assets/CSS/components/artwork/Artwork.module.css";
import path from "../../data/JSON/path.json";
import LikeImg from "../../assets/like.svg?react";
import { memo, useCallback, useEffect, useState } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { asyncDebounce } from "../../utils/debounce";
import axios from "axios";
import { Link } from "react-router-dom";

function ArtworkImgCard(props: { artwork: ArtworkType }) {
  const [artwork, setArtwork] = useState<ArtworkType>(props.artwork);
  const [isLike, setIsLike] = useState<boolean>(props.artwork.isLike);

  useEffect(() => {
    setIsLike(artwork.isLike);
  }, [artwork.isLike]);

  const handelLike = useCallback(
    asyncDebounce(async () => {
      await axios
        .post("/api/Work/Like", artwork.id)
        .then(() => {
          const temp = artwork;
          temp.isLike = !temp.isLike;
          setArtwork(temp);
        })
        .catch(() => alert("通訊錯誤，請稍後再試。"));
    }),
    [props.artwork]
  );

  return (
    <div className={style["artwork-block"]}>
      <Link
        className={style["link"]}
        to={`${(path.artworks.artwork + artwork.id) as string}`}
      >
        <img
          className={style["artwork"]}
          src={artwork.coverImg}
          alt={artwork.title}
        />
      </Link>
      <div className={style["like"]}>
        <button
          type="button"
          className={style["btn-like"]}
          onClick={() => {
            setIsLike(!isLike);
            handelLike();
          }}
        >
          <LikeImg
            className={
              style["icon-like"] + " " + (isLike ? style["is-like"] : "")
            }
          />
        </button>
      </div>
    </div>
  );
}
export default memo(ArtworkImgCard);
