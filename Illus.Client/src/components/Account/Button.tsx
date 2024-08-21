import style from "../../assets/CSS/components/Account/btn.module.css";

enum btnType {
  normal = 0,
  sure = 1,
  cancel = 2,
}
function btnClass(type: btnType): string {
  let typeStr: string = "";
  switch (type) {
    case btnType.normal:
      typeStr = style["normal"];
      break;
    case btnType.sure:
      typeStr = style["sure"];
      break;
    case btnType.cancel:
      typeStr = style["cancel"];
      break;
    default:
      typeStr = "";
  }
  return style["btn"] + " " + typeStr;
}
function Btn(props: {
  disabled?: boolean;
  text: string;
  onClick: (...args: any[]) => any;
  type: btnType;
}) {
  return (
    <button
      type="button"
      className={btnClass(props.type)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}

function SureBtn(props: {
  disabled?: boolean;
  text: string;
  onClick: (...args: any[]) => any;
}) {
  return (
    <Btn
      disabled={props.disabled}
      text={props.text}
      onClick={props.onClick}
      type={btnType.sure}
    />
  );
}
function NormalBtn(props: { text: string; onClick: (...args: any[]) => any }) {
  return (
    <Btn text={props.text} onClick={props.onClick} type={btnType.normal} />
  );
}
function CancelBtn(props: { text: string; onClick: (...args: any[]) => any }) {
  return (
    <Btn text={props.text} onClick={props.onClick} type={btnType.cancel} />
  );
}
export { SureBtn, NormalBtn, CancelBtn };
