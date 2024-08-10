import style from "../../assets/CSS/components/artwork/Artwork.module.css";
import path from "../../data/JSON/path.json";
import LikeImg from "../../assets/like.svg?react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { Link } from "react-router-dom";
import axios from "axios";
import { asyncDebounce } from "../../utils/debounce";
import ArtistCard from "../ArtistCard/ArtistCard";

function ArtworkCard(props: { artwork: ArtworkType }) {
  const [artwork, setArtwork] = useState<ArtworkType>(props.artwork);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(props.artwork.isLike);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout>>();

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

  const artistCard = useMemo(
    () => <ArtistCard artistId={artwork.artistId} artworkId={artwork.id} />,
    [artwork.id, artwork.artistId]
  );

  const timer = (hover: boolean) => {
    clearTimeout(hoverTimer);
    setHoverTimer(setTimeout(() => setIsHover(hover), 200));
  };

  return (
    <div className={style["card"]}>
      <div className={style["artwork-box"]}>
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
      <div className={style["data"]}>
        <Link
          className={style["link"] + " " + style["title"]}
          to={`${(path.artworks.artwork + artwork.id) as string}`}
        >
          {artwork.title}
        </Link>
        <div
          className={style["artist"]}
          onMouseOver={() => timer(true)}
          onMouseLeave={() => timer(false)}
        >
          <div className={style["head"]}>
            <Link
              className={style["head-link"]}
              to={`${(path.user.user + artwork.artistId) as string}`}
            >
              <img
                className={style["head-img"]}
                src={artwork.artistHeadshotContent}
                alt={artwork.artistName}
              />
            </Link>
          </div>
          <Link
            className={`${style["link"]}`}
            to={`${(path.user.user + artwork.artistId) as string}`}
          >
            {artwork.artistName}
          </Link>
          {isHover && artistCard}
        </div>
      </div>
    </div>
  );
}
export default memo(ArtworkCard);
