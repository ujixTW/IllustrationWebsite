import style from "../../assets/CSS/components/artwork/ArtworkSwitch.module.css";
import { ClickBtnEvent } from "../../utils/tsTypesHelper";

function ArtworkSwitchIndex(props: { index: number; max: number }) {
  return (
    <div className={style["count"]}>
      <div>
        {props.index}/{props.max}
      </div>
    </div>
  );
}

function ArtworkSwitch(props: {
  index: number;
  disabledBack: boolean;
  disabledNext: boolean;
  switchFnc: (targetIndex: number) => any;
}) {
  const { index, disabledBack, disabledNext, switchFnc } = props;

  return (
    <div className={style["scroll"]}>
      <button
        className={style["btn"] + " " + style["back"]}
        onClick={(e: ClickBtnEvent) => {
          e.stopPropagation();
          switchFnc(index - 1);
        }}
        disabled={disabledBack}
      ></button>
      <button
        className={style["btn"] + " " + style["next"]}
        onClick={(e: ClickBtnEvent) => {
          e.stopPropagation();
          switchFnc(index + 1);
        }}
        disabled={disabledNext}
      ></button>
    </div>
  );
}
export { ArtworkSwitch, ArtworkSwitchIndex };
