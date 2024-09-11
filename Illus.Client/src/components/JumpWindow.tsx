import style from "../assets/CSS/components/JumpWindow.module.css";
import { ClickBtnEvent, ClickDivEvent } from "../utils/tsTypesHelper";

function JumpWindow(props: {
  children: JSX.Element;
  closeFnc: (...args: any[]) => any;
}) {
  const closeWindow = (e: ClickBtnEvent | ClickDivEvent) => {
    e.stopPropagation();
    props.closeFnc();
  };

  return (
    <div className={style["back"]} onClick={closeWindow}>
      <div
        className={style["window"]}
        onClick={(e: ClickDivEvent) => e.stopPropagation()}
      >
        <button type="button" className={style["btn-x"]} onClick={closeWindow}>
          x
        </button>

        <div>{props.children}</div>
      </div>
    </div>
  );
}
export default JumpWindow;
