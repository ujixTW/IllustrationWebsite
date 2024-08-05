import Arrow from "../assets/arrow.svg?react";
import style from "../assets/CSS/components/UserMenu.module.css";
import { useContext, useEffect, useState } from "react";
import {
  IsLoginContext,
  UserDataContext,
  defaultUserDataContextValue,
} from "../context/LoginContext";
import { Link } from "react-router-dom";
import CapsuleSwitch from "./CapsuleSwitch";
import { ChangeEvent } from "../utils/tsTypesHelper";
import axios from "axios";

function UserMenu() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { setIsLogin } = useContext(IsLoginContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoutCheck, setLogoutCheck] = useState(false);

  const showName = userData.nickName ? userData.nickName : userData.account;

  const logout = async () => {
    await axios
      .get("/api/Logout")
      .then(() => {
        setIsLogin(false);
        setUserData(defaultUserDataContextValue);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const style = document.documentElement.style;
    if (!isDarkMode) {
      style.setProperty(
        "--bkC",
        getComputedStyle(document.documentElement).getPropertyValue("--bkC-D")
      );
      style.setProperty(
        "--fontC",
        getComputedStyle(document.documentElement).getPropertyValue("--fontC-D")
      );
    } else {
      style.setProperty(
        "--bkC",
        getComputedStyle(document.documentElement).getPropertyValue("--bkC-N")
      );
      style.setProperty(
        "--fontC",
        getComputedStyle(document.documentElement).getPropertyValue("--fontC-N")
      );
    }
  }, [isDarkMode]);

  return (
    <div className={style.menu} title={showName}>
      <label className={style["menu-switch"]}>
        <input
          type="checkbox"
          name="main menu switch"
          onChange={(e: ChangeEvent) => setMenuOpen(e.target.checked)}
        />
        <img
          width="40"
          height="40"
          src={userData.headshot}
          alt="user headshot"
          className={style.headshot}
        />
        <Arrow
          width="10"
          height="10"
          className={`${style["switch-arrow"]} ${
            menuOpen ? style["open"] : ""
          }`}
        />
      </label>

      {menuOpen && (
        <div className={style["menu-detail"]}>
          <div
            className={style.cover}
            style={{ backgroundImage: `url("${userData.cover}")` }}
          ></div>
          <div className={style["status"]}>
            <div>
              <Link to={`/user/${userData.id}`} title={showName}>
                <img
                  width="64"
                  height="64"
                  src={userData.headshot}
                  alt="user headshot"
                  className={style["headshot"]}
                ></img>
              </Link>
            </div>
            <div>{showName}</div>
            <div className={style.email}>
              {userData.email.slice(0, userData.email.indexOf("@"))}
            </div>
            <div className={style.follow}>
              <Link to={`/user/${userData.id}/following`}>
                <div>{userData.followingCount}</div>
                <div>關注中</div>
              </Link>
              <Link to={`/user/${userData.id}/follower`}>
                <div>{userData.followerCount}</div>
                <div>粉絲</div>
              </Link>
            </div>
          </div>
          <div className={style["item-group"]}>
            <div>
              <Link
                to={`/user/${userData.id}/likes`}
                className="user-likes user-menu-item"
                title="Like artworks"
              >
                收藏作品
              </Link>
            </div>
            <div>
              <Link
                to={`/user/${userData.id}/histories`}
                className="user-histories"
                title="Browse histories"
              >
                瀏覽紀錄
              </Link>
            </div>
          </div>
          <div className={style["item-group"]}>
            <label
              className={style["dark-theme"]}
              onChange={() => setIsDarkMode(!isDarkMode)}
            >
              <div>夜間模式</div>
              <CapsuleSwitch name="dark theme" />
            </label>
          </div>
          <div className={style["item-group"]}>
            <div>
              <Link to={`/user/${userData.id}/setting`}>設定</Link>
            </div>
          </div>
          <div className={`${style["logout"]} ${style["item-group"]}`}>
            <div onClick={() => setLogoutCheck(true)}>登出</div>
          </div>
        </div>
      )}
      {logoutCheck && (
        <div
          className={style["logout-window"]}
          onClick={() => setLogoutCheck(false)}
        >
          <div className={style["window"]}>
            <div>
              <button
                type="button"
                className={style["btn-x"]}
                onClick={() => setLogoutCheck(false)}
              >
                x
              </button>
            </div>
            <div>
              <h2>確定要登出嗎?</h2>
              <div>
                <button
                  type="button"
                  className={style["btn-check"]}
                  onClick={logout}
                >
                  登出
                </button>
                <button
                  type="button"
                  className={style["btn-check"]}
                  onClick={() => setLogoutCheck(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
