import { useEffect, useRef } from "react";
import style from "../../assets/CSS/pages/Artwork/ArtworkOrigin.module.css";
import {
  ArtworkSwitch,
  ArtworkSwitchIndex,
} from "../../components/artwork/ArtworkSwitch";
import { ArtworkType } from "../../data/typeModels/artwork";

function ArtworkOrigin(props: {
  artwork: ArtworkType;
  artworkAlt: string;
  originIndex: number;
  setOriginIndex: React.Dispatch<React.SetStateAction<number>>;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { artwork, artworkAlt, originIndex, setOriginIndex, setImgIndex } = props;
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTo(0, 0);
  }, [originIndex]);

  return (
    <div className={style["body"]} ref={bodyRef}>
      <div className={style["content"]}>
        {artwork.imgs.length > 1 && (
          <ArtworkSwitchIndex index={originIndex + 1} max={artwork.imgs.length} />
        )}
        <img
          src={artwork.imgs[originIndex].artworkContent}
          alt={artworkAlt}
          className={style["artwork"]}
          onClick={() => {
            setOriginIndex(-1);
            setImgIndex(originIndex + 1);
          }}
        />
        {artwork.imgs.length > 1 && (
          <ArtworkSwitch
            index={originIndex}
            disabledBack={originIndex <= 0}
            disabledNext={originIndex >= artwork.imgs.length - 1}
            switchFnc={setOriginIndex}
          />
        )}
      </div>
    </div>
  );
}
export default ArtworkOrigin;
