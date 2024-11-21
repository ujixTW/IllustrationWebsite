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
  originId: number;
  setOriginId: React.Dispatch<React.SetStateAction<number>>;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { artwork, artworkAlt, originId, setOriginId, setImgIndex } = props;
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTo(0, 0);
  }, [originId]);

  return (
    <div className={style["body"]} ref={bodyRef}>
      <div className={style["content"]}>
        {artwork.imgs.length > 1 && (
          <ArtworkSwitchIndex index={originId + 1} max={artwork.imgs.length} />
        )}
        <img
          src={artwork.imgs[originId].artworkContent}
          alt={artworkAlt}
          className={style["artwork"]}
          onClick={() => {
            setOriginId(-1);
            setImgIndex(originId + 1);
          }}
        />
        {artwork.imgs.length > 1 && (
          <ArtworkSwitch
            index={originId}
            disabledBack={originId <= 0}
            disabledNext={originId >= artwork.imgs.length - 1}
            switchFnc={setOriginId}
          />
        )}
      </div>
    </div>
  );
}
export default ArtworkOrigin;
