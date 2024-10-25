import Arrow from "../assets/SVG/arrow.svg?react";
import style from "../assets/CSS/components/UserMenu.module.css";
import path from "../data/JSON/path.json";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CapsuleSwitch from "./Button/CapsuleSwitch";
import LogOut from "./Logout";
import { useClickOutside } from "../hooks/useClickOutside";
import { useAppSelector } from "../hooks/redux";

function Detail(props: {
  showName: string;
  setMenuOpen: (...args: any[]) => void;
  isDarkMode: boolean;
  setIsDarkMode: (...args: any[]) => void;
}) {
  const userData = useAppSelector((state) => state.userData);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => props.setMenuOpen(false));

  const userLink: string = path.user.user + userData.id;

  return (
    <div className={style["menu-detail"]} ref={menuRef}>
      <div
        className={style.cover}
        style={{ backgroundImage: `url("${userData.cover}")` }}
      ></div>
      <div className={style["status"]}>
        <div>
          <Link to={`${userLink}`} title={props.showName}>
            <img
              width="64"
              height="64"
              src={userData.headshot}
              alt="user headshot"
              className={style["headshot"]}
            ></img>
          </Link>
        </div>
        <div>{props.showName}</div>
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
        <div className={style["item"] +" "+ style["post-artwork"]}>
          <Link to={path.artworks.create} title="Post artwork">上傳作品</Link>
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
          onChange={() => props.setIsDarkMode(!props.isDarkMode)}
        >
          <div>夜間模式</div>
          <CapsuleSwitch name="dark theme" checked={props.isDarkMode} />
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
  );
}

function UserMenu() {
  const userData = useAppSelector((state) => state.userData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const darkModeStorageKey = "darkMode";
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    const darkModeStorage = localStorage.getItem(darkModeStorageKey);
    if (darkModeStorage !== null) {
      setIsDarkMode(darkModeStorage === "true");
    }
  }, []);
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
    if (mounted.current === false) {
      mounted.current = true;
      return;
    }
    localStorage.setItem(darkModeStorageKey, `${isDarkMode}`);
  }, [isDarkMode]);

  const showName: string = userData.nickName
    ? userData.nickName
    : userData.account;

  return (
    <div className={style.menu} title={showName}>
      <label className={style["menu-switch"]}>
        <input
          type="checkbox"
          name="main menu switch"
          checked={menuOpen}
          onChange={async () => {
            await setTimeout(() => setMenuOpen(!menuOpen), 0);
          }}
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
        <Detail
          showName={showName}
          setMenuOpen={setMenuOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
    </div>
  );
}

export default UserMenu;
