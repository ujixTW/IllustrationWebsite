import { ArtworkType } from "../../data/typeModels/artwork";
import style from "../../assets/CSS/components/artwork/ArtworkList.module.css";
import { memo, useEffect } from "react";
import { Link, LinkProps, To } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";

function ArtworkList(props: {
  list: ArtworkType[];
  title?: string;
  more?: boolean;
  link?: To;
  getMoreDataFnc?: (...args: any[]) => any;
}) {
  const list = props.list.map((artwork: ArtworkType) => (
    <div className={style["item"]}>
      <ArtworkCard artwork={artwork} />
    </div>
  ));

  return (
    <div className={style["list-base"] + " " + style["base"]}>
      {props.title != undefined && (
        <div className={style["title-bar"]}>
          <h2>{props.title}</h2>
          {props.more && props.link != undefined && (
            <Link to={props.link} className={style["link"]}>
              more
            </Link>
          )}
        </div>
      )}
      <div className={style["content"]}>
        <div className={style["list"]}>{list}</div>
        {props.getMoreDataFnc != undefined && (
          <div className={style["more"]}>
            <button
              type="button"
              className={style["btn"]}
              onClick={props.getMoreDataFnc}
            >
              展開更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(ArtworkList);
