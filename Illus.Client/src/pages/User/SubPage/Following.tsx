import { useEffect, useState } from "react";
import style from "../../../assets/CSS/pages/User/SubPage/Following.module.css";
import path from "../../../data/JSON/path.json";
import { followListType, userDataType } from "../../../data/typeModels/user";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PageNav from "../../../components/PageNav";
import { userDataHelper } from "../../../utils/fromBackEndDataHelper";
import { pageParma } from "../../../utils/parmasHelper";
import axios from "axios";
import ArtworkBarListContainer from "../../../components/artwork/ArtworkBarListContainer";
import CheckBtn from "../../../components/Button/CheckBtn";
import { textOverLimitHelper } from "../../../utils/stringHelper";

function FollowingCard(props: { user: userDataType }) {
  const user = userDataHelper(props.user);
  const [isFollow, setIsFollow] = useState(true);

  const handleFollow = async () => {
    await axios
      .post(`/api/User/Follow/${user.id}`)
      .then(() => {
        setIsFollow(!isFollow);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={style["card"]}>
      <div className={style["artist"]}>
        <div className={style["headshot"]}>
          <Link to={path.user.user + user.id} className={style["link"]}>
            <img src={user.headshot} alt={user.nickName} />
          </Link>
        </div>
        <div className={style["data"]}>
          <div className={style["name"]}>
            <Link to={path.user.user + user.id} className={style["link"]}>
              {user.nickName}
            </Link>
          </div>
          <div className={style["profile"]}>
            {textOverLimitHelper(user.profile, 90)}
          </div>
          <CheckBtn
            text={isFollow ? "關注中" : "關注"}
            checked={!isFollow}
            name={user.nickName + "followBtn"}
            onChange={handleFollow}
            hasBackground
          />
        </div>
      </div>
      <div className={style["artwork"]}>
        <ArtworkBarListContainer
          list={user.artworkList ? user.artworkList : []}
          showArtTitle
        />
      </div>
    </div>
  );
}

function Following() {
  const [followerArr, setFollowerArr] = useState<followListType>({
    users: [],
    count: 0,
  });
  const { id } = useParams();
  const [searchParmas] = useSearchParams();

  const pageCount = 24;

  useEffect(() => {
    if (id === undefined) return;

    const pageStr = searchParmas.get(pageParma);

    const page =
      pageStr === null || !/^\d+$/.test(pageStr) ? 0 : parseInt(pageStr);

    axios
      .get(`/api/User/GetFollowingList/${id}`, {
        params: { p: page, count: pageCount },
      })
      .then((res) => {
        const data = res.data as followListType;
        setFollowerArr(data);
      })
      .catch((err) => console.log(err));
  }, [id, searchParmas]);

  const list = followerArr.users.map((item) => (
    <div key={item.id} className={style["user"]}>
      <FollowingCard user={item} />
    </div>
  ));

  return (
    <div className={style["body"]}>
      <h2 className={style["page-title"]}>
        用戶<span className={style["tip"]}>{followerArr.count}</span>
      </h2>
      <div className={style["user-container"]}>{list}</div>
      <PageNav max={followerArr.count} pageCount={pageCount} />
    </div>
  );
}
export default Following;
