import style from "./assets/CSS/RootLayout.module.css";
import path from "./data/JSON/path.json";
import IconLong from "./assets/IconLong.svg?react";
import { Link, Outlet, useLocation } from "react-router-dom";
import SearchBox from "./components/searchbox/SearchBox";
import { useEffect, useState } from "react";
import { userDataType } from "./data/typeModels/user";
import axios from "axios";
import {
  UserDataContext,
  defaultUserDataContextValue,
} from "./context/LoginContext";
import UserMenu from "./components/UserMenu";
import { ImagePathHelper } from "./utils/ImagePathHelper";
import { loginActions } from "./data/reduxModels/loginRedux";
import { useAppDispatch, useAppSelector } from "./hooks/redux";

function MainNav() {
  const isLogin = useAppSelector((state) => state.login);
  const location = useLocation();

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
          <Link to={path.artworks.create} className={style["btn"]}>
            上傳作品
          </Link>
          <UserMenu />
        </div>
      ) : location.pathname == path.home ? (
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
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<userDataType>(
    defaultUserDataContextValue
  );
  const loginHandler = () => {
    dispatch(loginActions.login());
  };
  useEffect(() => {
    axios.get("/api/LoginCheck").then((res) => {
      let userData = res.data as userDataType;
      userData.cover = ImagePathHelper(userData.cover);
      userData.headshot =
        userData.headshot != ""
          ? ImagePathHelper(userData.headshot)
          : defaultUserDataContextValue.headshot;
      setUserData(userData);
      loginHandler();
    });
  }, []);

  return (
    <>
      <UserDataContext.Provider
        value={{ userData: userData, setUserData: setUserData }}
      >
        <MainNav />
      </UserDataContext.Provider>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
