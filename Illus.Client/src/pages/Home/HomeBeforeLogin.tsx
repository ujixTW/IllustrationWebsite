import { Link } from "react-router-dom";
import style from "../../assets/CSS/pages/Home.module.css";
import path from "../../data/JSON/path.json";
import BeforeLoginLayOut from "../../layouts/BeforeLoginLayout";

export default function HomeBeforeLogin() {
  const Context = () => (
    <div className={style["before"]}>
      <div className={style["item"]}>
        <Link
          to={path.login.login}
          className={style["btn"] + " " + style["login"]}
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
