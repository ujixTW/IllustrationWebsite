import Arrow from "../assets/arrow.svg?react";
import style from "../assets/CSS/components/UserMenu.module.css";
import path from "../data/JSON/path.json";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/LoginContext";
import { Link } from "react-router-dom";
import CapsuleSwitch from "./Button/CapsuleSwitch";
import { ChangeEvent } from "../utils/tsTypesHelper";
import LogOut from "./Logout";

function UserMenu() {
  const { userData } = useContext(UserDataContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const userLink: string = path.user.user + userData.id;
  const showName: string = userData.nickName
    ? userData.nickName
    : userData.account;

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
              <Link to={`${userLink}`} title={showName}>
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
              <Link to={`${userLink + path.user.following}`}>
                <div>{userData.followingCount}</div>
                <div>關注中</div>
              </Link>
              <Link to={`${userLink + path.user.follower}`}>
                <div>{userData.followerCount}</div>
                <div>粉絲</div>
              </Link>
            </div>
          </div>
          <div className={style["item-group"]}>
            <div className={style["item"]}>
              <Link
                to={`${userLink + path.user.likes}`}
                className="user-likes user-menu-item"
                title="Like artworks"
              >
                收藏作品
              </Link>
            </div>
            <div className={style["item"]}>
              <Link
                to={`${userLink + path.user.histories}`}
                className="user-histories"
                title="Browse histories"
              >
                瀏覽紀錄
              </Link>
            </div>
          </div>
          <div className={style["item-group"]}>
            <label
              className={`${style["item"]} ${style["dark-theme"]}`}
              onChange={() => setIsDarkMode(!isDarkMode)}
            >
              <div>夜間模式</div>
              <CapsuleSwitch name="dark theme" checked={isDarkMode} />
            </label>
          </div>
          <div className={style["item-group"]}>
            <div className={style["item"]}>
              <Link to={`${userLink + path.user.settings}`}>設定</Link>
            </div>
          </div>
          <div className={`${style["logout"]} ${style["item-group"]}`}>
            {<LogOut itemClass={style["item"]} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
