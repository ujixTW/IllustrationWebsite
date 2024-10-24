import style from "../assets/CSS/components/Loading.module.css";

function Loading() {
  return (
    <div className={style["mask"]}>
      <div className={style["window"]}>
        <div className={style["loading-mark"]}></div>
      </div>
    </div>
  );
}
export default Loading;
