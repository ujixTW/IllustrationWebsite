import { useEffect, useRef, useState } from "react";
import style from "../../assets/CSS/pages/Artwork/ArtworkContainer.module.css";
import path from "../../data/JSON/path.json";
import Show from "../../assets/SVG/show.svg?react";
import Like from "../../assets/SVG/like.svg?react";
import { ArtworkType, TagType } from "../../data/typeModels/artwork";
import { Link, createSearchParams } from "react-router-dom";
import {
  ArtworkSwitch,
  ArtworkSwitchIndex,
} from "../../components/artwork/ArtworkSwitch";
import LikeBtn from "../../components/Button/LikeBtn";
import EditTag from "../../components/artwork/Edit/EditTag";
import { useScroll } from "../../hooks/useScroll";
import { useAppSelector } from "../../hooks/redux";

function ArtworkContainer(props: {
  artwork: ArtworkType;
  artworkAlt: string;
  originId: number;
  imgIndex: number;
  showMore: boolean;
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
  setOriginId: React.Dispatch<React.SetStateAction<number>>;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    artwork,
    artworkAlt,
    imgIndex,
    showMore,
    setShowMore,
    setOriginId,
    setImgIndex,
  } = props;
  const userId = useAppSelector((state) => state.userData.id);
  const isOwn = artwork.artistId == userId;
  const postTime = artwork.postTime;
  const [tagList, setTagList] = useState<TagType[]>(artwork.tags);
  const [addTag, setAddTag] = useState(false);
  const [optIsSticky, setOptIsSyicky] = useState(false);
  const artworkRefArr = useRef<HTMLDivElement[]>([]);
  const optPinRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollUp } = useScroll(window);
  const [optTranslate, setOptTranslate] = useState("0%");

  useEffect(() => {
    if (showMore) {
      handleScrollTo(imgIndex);
    }
  }, []);

  useEffect(() => {
    const handleEntry = (e: IntersectionObserverEntry[]) => {
      if (e[0].isIntersecting) {
        const arr = artworkRefArr.current;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == e[0].target) return setImgIndex(i + 1);
        }

        if (optPinRef.current && optPinRef.current == e[0].target) {
          setOptIsSyicky(true);
        }
      } else {
        if (optPinRef.current && optPinRef.current == e[0].target) {
          setOptIsSyicky(false);
        }
      }
    };
    const observer = new IntersectionObserver(handleEntry, {
      threshold: [0.8],
    });
    if (optPinRef.current) observer.observe(optPinRef.current);
    if (artworkRefArr.current.length > 0) {
      for (let item of artworkRefArr.current) {
        observer.observe(item);
      }
    }

    return () => {
      if (artworkRefArr.current.length > 0) {
        for (let item of artworkRefArr.current) {
          if (item) observer.unobserve(item);
        }
      }
      if (optPinRef.current) observer.unobserve(optPinRef.current);
    };
  }, [showMore]);

  useEffect(() => {
    if (scrollUp || optIsSticky) {
      setOptTranslate("0%");
    } else {
      setOptTranslate("100%");
    }
  }, [scrollY]);

  const handleScrollTo = (id: number) => {
    const target = artworkRefArr.current[id - 1];
    if (target) {
      window.scrollTo({ top: handleScrollTop(target), behavior: "instant" });
      setImgIndex(id);
    }
  };
  const handleScrollTop = (target: HTMLDivElement): number => {
    return target.offsetTop + 78;
  };

  const imgArr = artwork.imgs.map((img) => (
    <div
      key={artwork.title + " " + img.id}
      ref={(el: HTMLDivElement) => {
        artworkRefArr.current[img.id] = el;
      }}
      className={
        style["artwork-box"] + (img.id == 0 ? " " + style["first"] : "")
      }
    >
      <img
        src={img.content}
        alt={artworkAlt}
        className={
          style["artwork"] +
          (artwork.imgs.length > 1 && !showMore ? " " + style["pointer"] : "")
        }
        onClick={() => {
          if (showMore || artwork.imgs.length == 1) {
            if (!showMore) setShowMore(true);
            setOriginId(img.id);
          } else setShowMore(true);
        }}
      />
    </div>
  ));
  const tagLinkArr = tagList.map((tag) => (
    <Link
      to={{
        pathname: path.artworks.list,
        search: createSearchParams({ keywords: tag.content }).toString(),
      }}
      className={style["tag-link"]}
      key={"#" + tag.id + tag.content}
    >
      #{tag.content}
    </Link>
  ));

  return (
    <div className={style["artwork-container"]}>
      <figure className={style["img-container"]}>
        {artwork.imgs.length > 1 && (
          <ArtworkSwitchIndex index={imgIndex} max={artwork.imgs.length} />
        )}
        {showMore ? imgArr : imgArr[0]}
        {showMore && (
          <ArtworkSwitch
            index={imgIndex}
            disabledBack={imgIndex <= 1}
            disabledNext={imgIndex >= artwork.imgs.length}
            switchFnc={handleScrollTo}
          />
        )}
      </figure>
      <div className={style["opt-pin"]} ref={optPinRef}></div>
      <div className={style["option-container"]}>
        <div
          className={style["option"]}
          style={{ transform: `translateY(${optTranslate})` }}
        >
          {artwork.imgs.length > 1 && showMore == false && (
            <button
              type="button"
              className={style["more"]}
              onClick={() => setShowMore(true)}
            >
              <div className={style["more-btn"]}>查看全部</div>
            </button>
          )}
          <div className={style["operate"]}>
            <div className={style["box"]}>
              {isOwn ? (
                <div>
                  <Link
                    className={style["link"]}
                    to={path.artworks.artwork + artwork.id + path.artworks.edit}
                  >
                    編輯作品
                  </Link>
                </div>
              ) : (
                <div className={style["like"]}>
                  <LikeBtn artworkId={artwork.id} likeOrigin={artwork.isLike} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <figcaption>
        <div className={style["data-container"]}>
          <div className={style["data"]}>
            <h1 className={style["title"]}>{artwork.title}</h1>
            <div className={style["description-container"]}>
              {artwork.description}
            </div>
            <div className={style["tag-container"]}>
              {tagLinkArr}
              <button
                type="button"
                className={style["tag-add"]}
                onClick={() => setAddTag(true)}
              >
                +
              </button>
              {addTag && (
                <EditTag
                  artworkId={artwork.id}
                  isOwn={isOwn}
                  tagList={tagList}
                  setTagList={setTagList}
                  closeFnc={() => setAddTag(false)}
                />
              )}
            </div>
            <div className={style["watch"]}>
              <div>
                <dl>
                  <dt>
                    <Like className={style["icon"]} />
                  </dt>
                  <dd>{artwork.likeCount.toLocaleString()}</dd>
                </dl>
                <dl>
                  <dt>
                    <Show className={style["icon"]} />
                  </dt>
                  <dd>{artwork.readCount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
            <div className={style["post-time"]}>
              <time dateTime={artwork.postTime.toString()}>
                {postTime.getFullYear()}年{postTime.getMonth() + 1}月
                {postTime.getDate()}日&nbsp;
                {postTime.getHours()}:{postTime.getMinutes()}
              </time>
            </div>
          </div>
        </div>
      </figcaption>
    </div>
  );
}

export default ArtworkContainer;
