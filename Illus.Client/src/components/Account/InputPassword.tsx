import { useState } from "react";
import style from "../../assets/CSS/components/Account/Input.module.css";
import ShowIcon from "../../assets/show.svg?react";
import HideIcon from "../../assets/hide.svg?react";

export default function InputPassword(props: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className={style["pwd-container"]}>
      <input
        type={show ? "text" : "password"}
        placeholder="密碼"
        name="password"
        className={style["input-text"] + " " + style["pwd"]}
        autoComplete="current-password"
        autoCapitalize="off"
        value={props.value}
        onChange={props.onChange}
      />
      <div className={style["hidden"]}>
        {show ? (
          <HideIcon onClick={() => setShow(false)} />
        ) : (
          <ShowIcon onClick={() => setShow(true)} />
        )}
      </div>
    </div>
  );
}
