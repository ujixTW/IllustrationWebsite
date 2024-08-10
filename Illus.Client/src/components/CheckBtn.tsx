import { memo } from "react";
import style from "../assets/CSS/components/CheckBtn.module.css";

function CheckBtn(props: {
  checked: boolean;
  name:string;
  text: string;
  onChange: (value: any) => void;
  hasBackground?: boolean;
}) {
  return (
    <label className={style["btn"]}>
      <input
        className={style["check"]}
        type="checkbox"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
      />
      <div
        className={
          style["text"] + (props.hasBackground ? " " + style["has-bk"] : "")
        }
      >
        {props.text}
      </div>
    </label>
  );
}
export default memo(CheckBtn);
