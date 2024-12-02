import { useEffect } from "react";
import changeWebTitle from "../utils/changeWebTitle";
import style from "../assets/CSS/RootLayout.module.css";

function NoMatch() {
  useEffect(() => {
    changeWebTitle("查詢不到網頁 - ");
  }, []);
  return (
    <main className={style["not-found"]}>
      <h1>Page Not Found</h1>
    </main>
  );
}

export default NoMatch;
