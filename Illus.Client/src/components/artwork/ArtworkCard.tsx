import style from "../../assets/CSS/components/artwork/Artwork.module.css";
import path from "../../data/JSON/path.json";
import { memo, useMemo, useState } from "react";
import { ArtworkType } from "../../data/typeModels/artwork";
import { Link } from "react-router-dom";
import ArtistCard from "../ArtistCard/ArtistCard";
import ArtworkImgCard from "./ArtworkImgCard";

function ArtworkCard(props: { artwork: ArtworkType }) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout>>();

  const artistCard = useMemo(
    () => (
      <ArtistCard
        artistId={props.artwork.artistId}
        artworkId={props.artwork.id}
      />
    ),
    [props.artwork.id, props.artwork.artistId]
  );

  const timer = (hover: boolean) => {
    clearTimeout(hoverTimer);
    setHoverTimer(setTimeout(() => setIsHover(hover), 200));
  };

  return (
    <div className={style["card"]}>
      <div className={style["artwork-box"]}>
        <ArtworkImgCard artwork={props.artwork} />
      </div>
      <div className={style["data"]}>
        <Link
          className={style["link"] + " " + style["title"]}
          to={`${(path.artworks.artwork + props.artwork.id) as string}`}
        >
          {props.artwork.title}
        </Link>
        <div
          className={style["artist"]}
          onMouseOver={() => timer(true)}
          onMouseLeave={() => timer(false)}
        >
          <div className={style["head"]}>
            <Link
              className={style["head-link"]}
              to={`${(path.user.user + props.artwork.artistId) as string}`}
            >
              <img
                className={style["head-img"]}
                src={props.artwork.artistHeadshotContent}
                alt={props.artwork.artistName}
              />
            </Link>
          </div>
          <Link
            className={`${style["link"]}`}
            to={`${(path.user.user + props.artwork.artistId) as string}`}
          >
            {props.artwork.artistName}
          </Link>
          {isHover && artistCard}
        </div>
      </div>
    </div>
  );
}
export default memo(ArtworkCard);
