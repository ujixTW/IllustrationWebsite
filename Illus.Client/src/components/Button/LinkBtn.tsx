import { Link, To } from "react-router-dom";
import style from "../../assets/CSS/components/Button/LinkBtn.module.css";

type btnColorType =
  | "main-blue"
  | "red"
  | "background"
  | "font"
  | "black-translucent";

export default function LinkBtn(props: {
  text: string;
  link: To;
  color: btnColorType;
  state?: Object;
}) {
  return (
    <Link
      to={props.link}
      state={props.state}
      className={style["btn"] + " " + style[props.color]}
    >
      {props.text}
    </Link>
  );
}
