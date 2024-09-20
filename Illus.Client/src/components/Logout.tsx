import style from "../assets/CSS/components/Logout.module.css";
import { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../hooks/redux";
import { loginActions } from "../data/reduxModels/loginRedux";
import JumpWindow from "./JumpWindow";
import { userDataActions } from "../data/reduxModels/userDataRedux";

export default function LogOut(props: { itemClass: string }) {
  const dispatch = useAppDispatch();
  const [showWindow, setShowWindow] = useState(false);
  const logoutHandler = () => dispatch(loginActions.logout());

  const logout = async () => {
    await axios
      .get("/api/Logout")
      .then(() => {
        logoutHandler();
        dispatch(userDataActions.logout());
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className={props.itemClass} onClick={() => setShowWindow(true)}>
        登出
      </div>
      {showWindow && (
        <JumpWindow closeFnc={() => setShowWindow(false)}>
          <div className={style["window"]}>
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
                onClick={() => setShowWindow(false)}
              >
                取消
              </button>
            </div>
          </div>
        </JumpWindow>
      )}
    </>
  );
}
