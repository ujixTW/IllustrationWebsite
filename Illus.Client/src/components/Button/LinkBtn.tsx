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
}) {
  return (
    <Link to={props.link} className={style["btn"] + " " + style[props.color]}>
      {props.text}
    </Link>
  );
}
