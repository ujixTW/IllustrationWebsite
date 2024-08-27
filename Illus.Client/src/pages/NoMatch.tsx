import { useEffect } from "react";
import changeWebTitle from "../utils/changeWebTitle";

function NoMatch() {
  useEffect(() => {
    changeWebTitle("查詢不到網頁 - ");
  }, []);
  return (
    <main className="main main-no-match">
      <h1>Page Not Found</h1>
    </main>
  );
}

export default NoMatch;
