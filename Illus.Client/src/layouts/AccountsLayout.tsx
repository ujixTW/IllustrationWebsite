import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import style from "../assets/CSS/layouts/AccountsLayout.module.css";
import path from "../data/JSON/path.json";
import IconLong from "../assets/IconLong.svg?react";
import BeforeLoginLayOut from "./BeforeLoginLayout";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/redux";

function MainNav() {
  const location = useLocation();
  const isLogin: boolean = useAppSelector((state) => state.login);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLogin) navigate(path.home);
  }, []);

  const SignUpBtn = () => {
    return (
      <Link to={path.signUp.signUp} className={style["btn"]}>
        註冊
      </Link>
    );
  };
  const LoginBtn = () => {
    return (
      <Link to={path.login.login} className={style["btn"]}>
        登入
      </Link>
    );
  };

  return (
    <div className={style["main-nav"]}>
      <div className={style["item"]}>
        <Link to={path.home} className={style["home"]}>
          <IconLong height="100%" width="8rem" />
        </Link>
      </div>
      <div className={style["item"]}>
        {location.pathname == path.login.login ? (
          <SignUpBtn />
        ) : location.pathname == path.signUp.signUp ? (
          <LoginBtn />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default function AccountsLayout() {
  return (
    <>
      <MainNav />
      <main>
        <BeforeLoginLayOut context={<Outlet />} />
      </main>
    </>
  );
}
