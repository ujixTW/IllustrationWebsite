import style from "./assets/CSS/RootLayout.module.css";
import path from "./data/JSON/path.json";
import unLoginPathData from "./data/JSON/unLoginPath.json";
import IconLong from "./assets/IconLong.svg?react";
import { Link, Outlet } from "react-router-dom";
import SearchBox from "./components/searchbox/SearchBox";
import { useContext, useEffect, useState } from "react";
import { userDataType } from "./data/typeModels/user";
import axios from "axios";
import {
  IsLoginContext,
  UserDataContext,
  defaultUserDataContextValue,
} from "./context/LoginContext";
import UserMenu from "./components/UserMenu";
import { ImagePathHelper } from "./utils/ImagePathHelper";

function MainNav() {
  const { isLogin } = useContext(IsLoginContext);
  const [isUnLoginPath, setIsUnLogin] = useState<boolean>();

  useEffect(() => {
    if (!isLogin) {
      for (const path of unLoginPathData.unLoginPath) {
        if (path.path == location.pathname) {
          setIsUnLogin(true);
          break;
        }
        setIsUnLogin(false);
      }
    }
  }, [location.pathname]);

  return (
    <nav className={style["nav"] + " " + style["main-nav"]}>
      <div className={style["item"]}>
        <Link to={path.home} className={style["nav"] + " " + style["home"]}>
          <IconLong height="100%" width="8rem" />
        </Link>
      </div>
      <div className={style["item"]}>
        <SearchBox />
      </div>

      {isLogin ? (
        <div className={style["item"]}>
          <Link to={path.artworks.createArtwork} className={style["btn"]}>
            上傳作品
          </Link>
          <UserMenu />
        </div>
      ) : !isUnLoginPath ? (
        <div className={style["item"]}>
          <Link to={path.login.login} className={style["btn"]}>
            登入
          </Link>
          <Link to={path.signUp.signUp} className={style["btn"]}>
            註冊
          </Link>
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
}
function RootLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<userDataType>(
    defaultUserDataContextValue
  );
  useEffect(() => {
    // axios
    //   .get("/api/LoginCheck")
    //   .then((res) => {
    //     let userData = res.data as userDataType;
    //     userData.cover = ImagePathHelper(userData.cover);
    //     userData.headshot =
    //       userData.headshot != ""
    //         ? ImagePathHelper(userData.headshot)
    //         : "defaultImg/defaultHeadshot.svg";
    //     setUserData(userData);
    //     setIsLogin(true);
    //   });
  }, []);

  return (
    <UserDataContext.Provider
      value={{ userData: userData, setUserData: setUserData }}
    >
      <IsLoginContext.Provider
        value={{ isLogin: isLogin, setIsLogin: setIsLogin }}
      >
        <MainNav />
        <main>
          <Outlet />
        </main>
      </IsLoginContext.Provider>
    </UserDataContext.Provider>
  );
}

export default RootLayout;
