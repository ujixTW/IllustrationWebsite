import style from "../assets/CSS/pages/Home.module.css";
import path from "../data/JSON/path.json";
import IconLong from "../assets/IconLong.svg?react";
import { useContext } from "react";
import { IsLoginContext } from "../context/LoginContext";
import BeforeLoginLayOut from "../layouts/BeforeLoginLayout";
import { Link } from "react-router-dom";

function AfterLogin() {
  return (
    <div className={style["after"]}>
      <hr />
      <h1>Home Page</h1>
      <hr />
    </div>
  );
}
function BeforeLogin() {
  const Context = () => (
    <div className={style["before"]}>
      <div>
        <IconLong className={style['logo']} />
      </div>
      <div className={style["item"]}>
        <Link
          to={path.login.login}
          className={`${style["btn"]} ${style["login"]}`}
        >
          登入
        </Link>
      </div>
      <div className={style["item"]}>
        <Link to={path.signUp.signUp} className={style["btn"]}>
          註冊
        </Link>
      </div>
    </div>
  );
  return <BeforeLoginLayOut context={<Context />} />;
}

function Home() {
  const { isLogin } = useContext(IsLoginContext);

  return isLogin ? <AfterLogin /> : <BeforeLogin />;
}

export default Home;
