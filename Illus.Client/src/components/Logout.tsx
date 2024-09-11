import style from "../assets/CSS/components/Logout.module.css";
import { useContext, useState } from "react";
import { UserDataContext } from "../context/LoginContext";
import axios from "axios";
import { useAppDispatch } from "../hooks/redux";
import { loginActions } from "../data/reduxModels/loginRedux";
import { userDataTypeDef } from "../data/typeModels/user";
import JumpWindow from "./JumpWindow";

export default function LogOut(props: { itemClass: string }) {
  const dispatch = useAppDispatch();
  const { setUserData } = useContext(UserDataContext);
  const [showWindow, setShowWindow] = useState(false);
  const logoutHandler = () => dispatch(loginActions.logout());

  const logout = async () => {
    await axios
      .get("/api/Logout")
      .then(() => {
        logoutHandler();
        setUserData(userDataTypeDef);
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
