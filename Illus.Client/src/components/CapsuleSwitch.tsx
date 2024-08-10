import style from "../assets/CSS/components/CapsuleSwitch.module.css";

export default function CapsuleSwitch(props: {
  name: string;
  checked: boolean;
}) {
  return (
    <label className={style.base} form={props.name}>
      <input
        type="checkbox"
        name={props.name}
        className={style.check}
        defaultChecked={props.checked}
      />
      <span className={style.box}>
        <span className={style.switch}></span>
      </span>
    </label>
  );
}
