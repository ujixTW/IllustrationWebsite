import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/Artwork/Artwork.module.css";
import path from "../../data/JSON/path.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArtworkListType, ArtworkType } from "../../data/typeModels/artwork";
import ArtworkBarListContainer from "../../components/artwork/ArtworkBarListContainer";
import ArtistNametabe from "../../components/ArtistCard/ArtistNametabe";
import ArtworkContainer from "./ArtworkContainer";
import ArtworkOrigin from "./ArtworkOrigin";
import CommandList from "../../components/artwork/Command/CommandList";
import changeWebTitle from "../../utils/changeWebTitle";
import axios from "axios";
import { useAppSelector } from "../../hooks/redux";
import useFollowUser from "../../hooks/useFollowUser";
import { userDataType } from "../../data/typeModels/user";
import { fromBackEndArtworkDataHelper } from "../../utils/fromBackEndDataHelper";

function Base(props: { artwork: ArtworkType; children: JSX.Element }) {
  const { artwork } = props;
  const userId = useAppSelector((state) => state.userData.id);
  const [artistArtworkList, setArtistArtworkList] = useState<ArtworkType[]>([]);

  const { followBtn, setIsFollow } = useFollowUser(artwork.artistId);

  const pageCount = 8;
  const userLink = path.user.user + artwork.artistId;

  useEffect(() => {
    axios
      .get(`/api/User/${props.artwork.artistId}`)
      .then((res) => {
        const data: userDataType = res.data;
        setIsFollow(data.isFollow);
      })
      .catch((err) => console.log(err));

    handleGetArtistArtwork();
  }, []);

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
                  <div className={style["follow-btn"]}>{followBtn}</div>
                )}

                <div className={style["more-btn"]}>
                  <Link to={userLink}>查看作品目錄</Link>
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
  const [originIndex, setOriginIndex] = useState(-1);
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

        setArtwork(fromBackEndArtworkDataHelper(data));
      })
      .catch(() => navigate("notFound"));
  }, [artworkId]);
  useEffect(() => {
    if (artwork) {
      const titleStart =
        artwork.tags.length > 0 ? `#${artwork.tags[0].content} ` : "";

      changeWebTitle(
        `${titleStart + artwork.title} - ${artwork.artistName}的插畫 - `
      );
    }
  }, [artwork]);

  return originIndex > -1 && artwork ? (
    <ArtworkOrigin
      artwork={artwork}
      artworkAlt={artworkAlt}
      originIndex={originIndex}
      setOriginIndex={setOriginIndex}
      setImgIndex={setImgIndex}
    />
  ) : artwork ? (
    <Base artwork={artwork}>
      <ArtworkContainer
        artwork={artwork}
        artworkAlt={artworkAlt}
        originIndex={originIndex}
        imgIndex={imgIndex}
        showMore={showMore}
        setOriginIndex={setOriginIndex}
        setImgIndex={setImgIndex}
        setShowMore={setShowMore}
      />
    </Base>
  ) : (
    <></>
  );
}

export default Artwork;
