import { Link } from "react-router-dom";
import style from "../../assets/CSS/components/ArtistCard/ArtistNameTabe.module.css";
import path from "../../data/JSON/path.json";
import ArtistCard from "./ArtistCard";
import { useState } from "react";

function ArtistNametabe(props: { Id: number; headshot: string; name: string }) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout>>();
  const timer = (hover: boolean) => {
    clearTimeout(hoverTimer);
    setHoverTimer(setTimeout(() => setIsHover(hover), 200));
  };
  return (
    <div className={style["container"]}>
      <div
        className={style["artist"]}
        onMouseOver={() => timer(true)}
        onMouseLeave={() => timer(false)}
      >
        <div className={style["head"]}>
          <Link
            className={style["head-link"]}
            to={`${(path.user.user + props.Id) as string}`}
          >
            <img
              className={style["head-img"]}
              src={props.headshot}
              alt={props.name}
            />
          </Link>
        </div>
        <Link
          className={`${style["link"]}`}
          to={`${(path.user.user + props.Id) as string}`}
        >
          {props.name}
        </Link>
        {isHover && <ArtistCard artistId={props.Id} />}
      </div>
    </div>
  );
}
export default ArtistNametabe;
