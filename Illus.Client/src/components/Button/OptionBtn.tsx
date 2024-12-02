import { useEffect, useState } from "react";
import style from "../../assets/CSS/components/Button/OptionBtn.module.css";

type BtnType = "checkbox" | "radio";

function OptionBtn(props: {
  name: string;
  type: BtnType;
  onChange: (...args: any[]) => void;
  value?: string | number | undefined | readonly string[];
  checked?: boolean;
  text: string;
}) {
  const [subClass, setSubClass] = useState<string>("");

  useEffect(() => {
    let _class = "";
    switch (props.type) {
      case "checkbox":
        _class = " " + style["checkbox"];
        break;
      case "radio":
        _class = " " + style["radio"];
        break;
      default:
        _class = " " + style["checkbox"];
        break;
    }
    setSubClass(_class);
  }, []);

  return (
    <label className={style["container"]}>
      <input
        type={props.type}
        name={props.name}
        className={style["btn"] + subClass}
        onChange={props.onChange}
        checked={props.checked}
        value={props.value}
      />
      <div className={style["describe"]}>{props.text}</div>
    </label>
  );
}

export default OptionBtn;
