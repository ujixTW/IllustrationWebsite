import style from "../../assets/CSS/components/modals/UnsavedChangeModal.module.css";
import { NormalBtn, SureBtn } from "../Button/BasicButton";
import JumpWindow from "../JumpWindow";

function UnsavedChangeModal(props: {
  onCancel: (...args: any[]) => void;
  onConfirm: (...args: any[]) => void;
}) {
  return (
    <JumpWindow closeFnc={props.onCancel}>
      <div className={style["modal"]}>
        <div className={style["message"]}>資料尚未儲存 ， 確定要離開嗎?</div>
        <div className={style["btn-container"]}>
          <div className={style["btn"]}>
            <SureBtn text="確定" onClick={props.onConfirm} />
          </div>
          <div className={style["btn"]}>
            <NormalBtn text="取消" onClick={props.onCancel} />
          </div>
        </div>
      </div>
    </JumpWindow>
  );
}
export default UnsavedChangeModal;
