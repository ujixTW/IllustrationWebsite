import { ArtworkType } from "../../data/typeModels/artwork";
import style from "../../assets/CSS/components/artwork/ArtworkList.module.css";
import Arrow from "../../assets/SVG/arrow.svg?react";
import ArtworkCard from "./ArtworkCard";
import { Link, To } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";

function ArtworkBarList(props: {
  list: ArtworkType[];
  title?: string;
  link?: To;
  getMoreDataFnc?: (...args: any[]) => any;
  showArtTitle?: boolean;
  showArtistData?: boolean;
  length?: number;
  isOwn?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [totalSkip, setTotalSkip] = useState<number>(0);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (itemRef.current != null) {
      const skipCount = skip();

      if (totalSkip + skipCount >= props.list.length) {
        setEnd(true);
      } else if (
        totalSkip + skipCount * 2 >= props.list.length &&
        props.getMoreDataFnc != undefined
      ) {
        props.getMoreDataFnc();
      } else {
        setEnd(false);
      }
    }
  }, [totalSkip]);

  const list = props.list.map((artwork: ArtworkType) => (
    <div
      key={props.title + artwork.id.toString()}
      className={style["item"]}
      ref={itemRef}
    >
      <ArtworkCard
        artwork={artwork}
        showArtTitle={props.showArtTitle}
        showArtistData={props.showArtistData}
        length={props.length}
        isOwn={props.isOwn}
      />
    </div>
  ));

  const skip = () => {
    const list = listRef.current;
    const item = itemRef.current;
    let skip = 0;
    if (list != null && item != null) {
      skip = Math.floor(list.clientWidth / item.offsetWidth);
    }
    return skip;
  };

  const handleNext = () => {
    if (listRef.current != null && itemRef.current != null) {
      const skipCount = skip();
      listRef.current.scrollLeft += itemRef.current.offsetWidth * skipCount;
      let total = totalSkip + skipCount;
      setTotalSkip(total);
    }
  };
  const handleBack = () => {
    if (listRef.current != null && itemRef.current != null) {
      const skipCount = skip();
      listRef.current.scrollLeft -= itemRef.current.offsetWidth * skipCount;
      let total = totalSkip - skipCount;

      setTotalSkip(total < 0 ? 0 : total);
    }
  };

  return (
    <div className={style["bar"] + " " + style["base"]}>
      {props.title != undefined && (
        <div className={style["title-bar"]}>
          <h2 className={style["title"]}>{props.title}</h2>
          {props.link != undefined && (
            <Link to={props.link} className={style["link"]}>
              more
            </Link>
          )}
        </div>
      )}

      <div className={style["content"]}>
        <div className={style["list"]} ref={listRef}>
          {list}
        </div>

        {totalSkip > 1 && (
          <div className={style["back"] + " " + style["btn-box"]}>
            <button type="button" className={style["btn"]} onClick={handleBack}>
              <Arrow className={style["back-svg"]} />
            </button>
          </div>
        )}
        {end != true && (
          <div className={style["next"] + " " + style["btn-box"]}>
            <button type="button" className={style["btn"]} onClick={handleNext}>
              <Arrow className={style["next-svg"]} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ArtworkBarList);
