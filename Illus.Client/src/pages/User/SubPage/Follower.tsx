import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import style from "../../../assets/CSS/pages/User/SubPage/Follower.module.css";
import path from "../../../data/JSON/path.json";
import { useAppSelector } from "../../../hooks/redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { followListType, userDataType } from "../../../data/typeModels/user";
import { pageParma } from "../../../utils/parmasHelper";
import PageNav from "../../../components/PageNav";
import userDataHelper from "../../../utils/userDataHelper";
import CheckBtn from "../../../components/Button/CheckBtn";
import ArtistCard from "../../../components/ArtistCard/ArtistCard";

function DropDownTrigger(props: { children: JSX.Element; userId: number }) {
  const [isHover, setIsHover] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout>>();
  const timer = (hover: boolean) => {
    clearTimeout(hoverTimer);
    setHoverTimer(setTimeout(() => setIsHover(hover), 200));
    console.log(hover);
  };
  return (
    <div
      className={style["drop-down"]}
      onMouseOver={() => timer(true)}
      onMouseLeave={() => timer(false)}
    >
      {props.children}
      {isHover && <ArtistCard artistId={props.userId} />}
    </div>
  );
}

function FollowerCard(props: { user: userDataType }) {
  const user = userDataHelper(props.user);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    setIsFollow(props.user.isFollow);
  }, []);

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
      <DropDownTrigger userId={user.id}>
        <div className={style["headshot"]}>
          <Link to={path.user.user + user.id} className={style["link"]}>
            <img src={user.headshot} alt="headshot" />
          </Link>
        </div>
      </DropDownTrigger>
      <div className={style["option"]}>
        <DropDownTrigger userId={user.id}>
          <div className={style["nickname"]}>
            <Link to={path.user.user + user.id} className={style["link"]}>
              {user.nickName}
            </Link>
          </div>
        </DropDownTrigger>
        <CheckBtn
          text={isFollow ? "關注中" : "關注"}
          checked={!isFollow}
          name={user.nickName + "followBtn"}
          onChange={handleFollow}
          hasBackground
        />
      </div>
    </div>
  );
}

function Follower() {
  const userId = useAppSelector((state) => state.userData.id);
  const [followerArr, setFollowerArr] = useState<followListType>({
    users: [],
    count: 0,
  });
  const { id } = useParams();
  const [searchParmas] = useSearchParams();
  const navigate = useNavigate();

  const pageCount = 24;

  useEffect(() => {
    if (id === undefined) return;
    if (userId !== parseInt(id))
      return navigate(path.user.user + id + path.user.following);

    const pageStr = searchParmas.get(pageParma);

    const page =
      pageStr === null || !/^\d+$/.test(pageStr) ? 0 : parseInt(pageStr);

    axios
      .get("/api/User/GetFollowerList", {
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
      <FollowerCard user={item} />
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
export default Follower;
