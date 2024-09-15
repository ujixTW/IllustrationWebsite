import { useState } from "react";
import style from "../../assets/CSS/components/Account/Input.module.css";
import ShowIcon from "../../assets/SVG/show.svg?react";
import HideIcon from "../../assets/SVG/hide.svg?react";

export default function InputPassword(props: {
  id?: string;
  isNew: boolean;
  isSec?: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className={style["pwd-container"]}>
      <input
        type={show ? "text" : "password"}
        placeholder="密碼"
        id={props.id}
        name={props.isSec != true ? "password" : "secPwd"}
        className={style["input-text"] + " " + style["pwd"]}
        autoComplete={props.isNew ? "new-password" : "current-password"}
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
