import style from "../../assets/CSS/components/Account/Input.module.css";
export default function InputGuid(props: {
  id?: string;
  value: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      id={props.id}
      name="guid"
      className={style["input-text"]}
      autoComplete="new-password"
      autoCapitalize="off"
      value={props.value}
      onChange={props.onChange}
    />
  );
}
