import style from "./assets/CSS/RootLayout.module.css";
import path from "./data/JSON/path.json";
import IconLong from "./assets/SVG/IconLong.svg?react";
import { Link, Outlet, useLocation } from "react-router-dom";
import SearchBox from "./components/searchbox/SearchBox";
import { useEffect } from "react";
import { userDataType } from "./data/typeModels/user";
import axios from "axios";
import UserMenu from "./components/UserMenu";
import { loginActions } from "./data/reduxModels/loginRedux";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import BackToTopBtn from "./components/Button/BackToTopBtn";
import { userDataActions } from "./data/reduxModels/userDataRedux";
import userDataHelper from "./utils/userDataHelper";

function MainNav() {
  const isLogin = useAppSelector((state) => state.login);
  const emailConfirmed = useAppSelector((state) => state.userData.emailConfirm);
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
          {emailConfirmed && (
            <Link
              to={path.artworks.create}
              className={style["btn"] + " " + style["post-artwork"]}
            >
              上傳作品
            </Link>
          )}
          <UserMenu />
        </div>
      ) : location.pathname == path.home ? (
        <div className={style["item"]}>
          <Link
            to={path.login.login}
            className={style["btn"] + " " + style["unlogin"]}
          >
            登入
          </Link>
          <Link
            to={path.signUp.signUp}
            className={style["btn"] + " " + style["unlogin"]}
          >
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
  const loginHandler = () => {
    dispatch(loginActions.login());
  };
  useEffect(() => {
    axios
      .get("/api/LoginCheck")
      .then((res) => {
        const userData: userDataType = userDataHelper(res.data);
        dispatch(userDataActions.setUserData(userData));
        loginHandler();
      })
      .catch(() => dispatch(loginActions.logout()));
  }, []);

  return (
    <>
      <MainNav />
      <main>
        <button
          type="button"
          onClick={() => dispatch(loginActions.login())}
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            border: "0",
            borderRadius: "1rem",
            width: "50px",
            height: "50px",
            backgroundColor: "var(--mainBlue)",
            color: "white",
            zIndex: "2",
            cursor: "pointer",
          }}
        >
          登入狀態
        </button>
        <BackToTopBtn />
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
