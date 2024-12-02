import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import style from "../assets/CSS/layouts/UserSubLayout.module.css";
import BackSVG from "../assets/SVG/pageUp.svg?react";
import CoverEditor from "../components/User/CoverEditor";
import path from "../data/JSON/path.json";
import { useEffect, useState } from "react";
import { userDataType, userDataTypeDef } from "../data/typeModels/user";
import LinkBtn from "../components/Button/LinkBtn";
import axios from "axios";
import { useAppSelector } from "../hooks/redux";
import { userDataHelper } from "../utils/fromBackEndDataHelper";

enum pageEnum {
  following,
  follower,
}

function UserSubLayout() {
  const isLogin = useAppSelector((state) => state.login);
  const userId = useAppSelector((state) => state.userData.id);
  const { id } = useParams();
  const [user, setUser] = useState<userDataType>(userDataTypeDef);
  const [isOwn, setIsOwn] = useState(false);
  const [indexPage, setIndexPage] = useState<pageEnum>(pageEnum.following);
  const location = useLocation();
  const navigate = useNavigate();
  const activeClass = " " + style["active"];

  useEffect(() => {
    if (id === undefined || !/^\d+$/.test(id.trim()) || !isLogin)
      return navigate(path.home);

    setIsOwn(userId === parseInt(id));

    axios
      .get(`/api/User/${id.trim()}`)
      .then((res) => {
        const data = res.data as userDataType;
        setUser(userDataHelper(data));
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (/\/\d+\/follower/.test(location.pathname)) {
      setIndexPage(pageEnum.follower);
    }
    if (/\/\d+\/following/.test(location.pathname)) {
      setIndexPage(pageEnum.following);
    }
  }, [location.pathname]);

  return (
    <div className={style["body"]}>
      <div className={style["header"]}>
        <div className={style["cover"]}>
          <CoverEditor imgUrl={user.cover} isOwn={isOwn} />
        </div>
      </div>
      <div className={style["main"]}>
        <div className={style["option"]}>
          <div className={style["user"]}>
            <Link to={path.user.user + id} className={style["back"]}>
              <BackSVG className={style["svg"]} />
              <img
                src={user.headshot}
                alt="headshot"
                className={style["headshot"]}
              />
            </Link>
            <span>{user.nickName}</span>
          </div>
          <div className={style["nav"]}>
            <div
              className={
                style["btn"] +
                (indexPage === pageEnum.following ? activeClass : "")
              }
            >
              <LinkBtn
                text="關注中"
                link={path.user.user + id + path.user.following}
                color="background"
              />
            </div>
            {isOwn && (
              <div
                className={
                  style["btn"] +
                  (indexPage === pageEnum.follower ? activeClass : "")
                }
              >
                <LinkBtn
                  text="粉絲"
                  link={path.user.user + id + path.user.follower}
                  color="background"
                />
              </div>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default UserSubLayout;
