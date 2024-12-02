import style from "./assets/CSS/RootLayout.module.css";
import path from "./data/JSON/path.json";
import IconLong from "./assets/SVG/IconLong.svg?react";
import { Link, Outlet } from "react-router-dom";
import SearchBox from "./components/searchbox/SearchBox";
import { useEffect, useState } from "react";
import { loginCheckType } from "./data/typeModels/user";
import axios from "axios";
import UserMenu from "./components/UserMenu";
import { loginActions } from "./data/reduxModels/loginRedux";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import BackToTopBtn from "./components/Button/BackToTopBtn";
import { userDataActions } from "./data/reduxModels/userDataRedux";

function MainNav() {
  const isLogin = useAppSelector((state) => state.login);
  const emailConfirmed = useAppSelector((state) => state.userData.emailConfirm);

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
      ) : (
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
      )}
    </nav>
  );
}
function RootLayout() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignoreResult = false;

    const loginCheck = async () => {
      await axios
        .get("/api/LoginCheck")
        .then((res) => {
          if (!ignoreResult) {
            const data: loginCheckType = res.data;

            dispatch(
              data.isLogin ? loginActions.login() : loginActions.logout()
            );
            if (data.isLogin)
              dispatch(userDataActions.setUserData(data.userData));
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    };
    loginCheck();
    return () => {
      ignoreResult = true;
    };
  }, []);

  return !isLoading ? (
    <>
      <MainNav />
      <main>
        <BackToTopBtn />
        <Outlet />
      </main>
    </>
  ) : (
    <></>
  );
}

export default RootLayout;
