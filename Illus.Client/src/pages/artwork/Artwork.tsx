import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/Artwork/Artwork.module.css";
import path from "../../data/JSON/path.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArtworkListType, ArtworkType } from "../../data/typeModels/artwork";
import CheckBtn from "../../components/Button/CheckBtn";
import ArtworkBarListContainer from "../../components/artwork/ArtworkBarListContainer";
import ArtistNametabe from "../../components/ArtistCard/ArtistNametabe";
import ArtworkContainer from "./ArtworkContainer";
import ArtworkOrigin from "./ArtworkOrigin";
import CommandList from "../../components/artwork/Command/CommandList";
import changeWebTitle from "../../utils/changeWebTitle";
import {
  ArtworkImgListHelper,
  ImagePathHelper,
} from "../../utils/ImagePathHelper";
import axios from "axios";
import { useAppSelector } from "../../hooks/redux";

function Base(props: { artwork: ArtworkType; children: JSX.Element }) {
  const { artwork } = props;
  const userId = useAppSelector((state) => state.userData.id);
  const [isFollow, setIsFollow] = useState(false);
  const [artistArtworkList, setArtistArtworkList] = useState<ArtworkType[]>([]);
  const pageCount = 8;
  const userLink = path.user.user + artwork.artistId;

  useEffect(() => {
    handleGetArtistArtwork();
  }, []);

  const handleFollow = async () => {
    await axios
      .post(`/api/User/Follow/${artwork.artistId}`)
      .then(() => {
        setIsFollow(!isFollow);
      })
      .catch(() => {
        "通訊錯誤，請稍後再試";
      });
  };
  const handleGetArtistArtwork = async () => {
    await axios
      .get(`/api/Work/GetList/Artist/${artwork.artistId}`, {
        params: {
          page: artistArtworkList.length / pageCount,
          workCount: pageCount,
        },
      })
      .then((res) => {
        const data: ArtworkListType = res.data;
        if (data.artworkList.length > 0) {
          const copyList = [...artistArtworkList];
          copyList.push(...data.artworkList);
          setArtistArtworkList(copyList);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={style["body"]}>
      <div className={style["content"]}>
        <div className={style["artwork-area"]}>{props.children}</div>
        <div className={style["other-area"]}>
          <div className={style["container"]}>
            <div className={style["artist"] + " " + style["inner-box"]}>
              <div className={style["data"]}>
                <div className={style["name"]}>
                  <ArtistNametabe
                    Id={artwork.artistId}
                    headshot={artwork.artistHeadshotContent}
                    name={artwork.artistName}
                  />
                </div>
                {artwork.artistId != userId && (
                  <div className={style["follow-btn"]}>
                    <CheckBtn
                      text={isFollow ? "關注中" : "加關注"}
                      name="followArtist"
                      onChange={handleFollow}
                      checked={!isFollow}
                      hasBackground
                    />
                  </div>
                )}

                <div className={style["more-btn"]}>
                  <Link to={userLink + path.user.artworks}>查看作品目錄</Link>
                </div>
              </div>
              <div className={style["artist-artwork"]}>
                {artistArtworkList.length > 0 && (
                  <ArtworkBarListContainer
                    list={artistArtworkList}
                    getMoreDataFnc={handleGetArtistArtwork}
                    length={136}
                  />
                )}
              </div>
            </div>
          </div>
          <hr className={style["hr"]} />
          <div className={style["container"]}>
            <div className={style["command"] + " " + style["inner-box"]}>
              <CommandList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Artwork() {
  const { artworkId } = useParams();
  const [artwork, setArtwork] = useState<ArtworkType | undefined>(undefined);
  const [showMore, setShowMore] = useState(false);
  const [originId, setOriginId] = useState(-1);
  const [imgIndex, setImgIndex] = useState(1);
  const navigate = useNavigate();
  const artworkAlt = artwork
    ? `${artwork.tags.length > 0 ? "#" + artwork.tags[0].content : ""} ${
        artwork.title
      } - ${artwork.artistName}的插畫`
    : "";

  useEffect(() => {
    axios
      .get(`/api/Work/${artworkId}`)
      .then((res) => {
        const data: ArtworkType = res.data;
        data.imgs = ArtworkImgListHelper(data.imgs);
        data.artistHeadshotContent = ImagePathHelper(
          data.artistHeadshotContent
        );
        setArtwork(data);
      })
      .catch(() => navigate("notFound"));
  }, []);
  useEffect(() => {
    if (artwork) {
      const titleStart =
        artwork.tags.length > 0 ? `#${artwork.tags[0].content} ` : "";

      changeWebTitle(
        `${titleStart + artwork.title} - ${artwork.artistName}的插畫 - `
      );
    }
  }, [artwork]);

  return originId > -1 && artwork ? (
    <ArtworkOrigin
      artwork={artwork}
      artworkAlt={artworkAlt}
      originId={originId}
      setOriginId={setOriginId}
      setImgIndex={setImgIndex}
    />
  ) : artwork ? (
    <Base artwork={artwork}>
      <ArtworkContainer
        artwork={artwork}
        artworkAlt={artworkAlt}
        originId={originId}
        imgIndex={imgIndex}
        showMore={showMore}
        setOriginId={setOriginId}
        setImgIndex={setImgIndex}
        setShowMore={setShowMore}
      />
    </Base>
  ) : (
    <></>
  );
}

export default Artwork;
