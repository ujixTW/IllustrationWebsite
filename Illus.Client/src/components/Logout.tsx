import style from "../assets/CSS/components/LogOut.module.css";
import { useContext, useState } from "react";
import {
  IsLoginContext,
  UserDataContext,
  defaultUserDataContextValue,
} from "../context/LoginContext";
import axios from "axios";
import { ClickBtnEvent, ClickDivEvent } from "../utils/tsTypesHelper";

export default function LogOut(props: { itemClass: string }) {
  const { setIsLogin } = useContext(IsLoginContext);
  const { setUserData } = useContext(UserDataContext);
  const [isLogout, setIsLogout] = useState(false);

  const logout = async () => {
    await axios
      .get("/api/Logout")
      .then(() => {
        setIsLogin(false);
        setUserData(defaultUserDataContextValue);
      })
      .catch((err) => console.log(err));
  };
  const closeWindow = (e: ClickBtnEvent | ClickDivEvent) => {
    e.stopPropagation();
    setIsLogout(false);
  };
  return (
    <>
      <div
        className={props.itemClass}
        onClick={() => setIsLogout(true)}
      >
        登出
      </div>
      {isLogout && (
        <div className={style["logout"]} onClick={closeWindow}>
          <div
            className={style["window"]}
            onClick={(e: ClickDivEvent) => e.stopPropagation()}
          >
            <div>
              <button
                type="button"
                className={style["btn-x"]}
                onClick={closeWindow}
              >
                x
              </button>
            </div>
            <div>
              <h2>確定要登出嗎?</h2>
              <div>
                <button
                  type="button"
                  className={style["btn-check"]}
                  onClick={logout}
                >
                  登出
                </button>
                <button
                  type="button"
                  className={style["btn-check"]}
                  onClick={closeWindow}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
