import style from "../assets/CSS/components/LogOut.module.css";
import { useContext, useState } from "react";
import {
  UserDataContext,
  defaultUserDataContextValue,
} from "../context/LoginContext";
import axios from "axios";
import { ClickBtnEvent, ClickDivEvent } from "../utils/tsTypesHelper";
import { useAppDispatch } from "../hooks/redux";
import { loginActions } from "../data/reduxModels/loginRedux";

export default function LogOut(props: { itemClass: string }) {
  const dispatch = useAppDispatch();
  const { setUserData } = useContext(UserDataContext);
  const [isLogout, setIsLogout] = useState(false);
  const logoutHandler = () => dispatch(loginActions.logout());

  const logout = async () => {
    await axios
      .get("/api/Logout")
      .then(() => {
        logoutHandler();
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
      <div className={props.itemClass} onClick={() => setIsLogout(true)}>
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
