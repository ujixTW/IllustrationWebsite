import style from "../../assets/CSS/components/Account/Input.module.css";
export default function InputEmail(props: {
  id?: string;
  value: string;
  onChange: (...args: any[]) => any;
}) {
  return (
    <input
      type="text"
      id={props.id}
      name="email"
      className={style["input-text"]}
      placeholder="email@illus.com"
      autoComplete="email"
      autoCapitalize="off"
      value={props.value}
      onChange={props.onChange}
    />
  );
}
