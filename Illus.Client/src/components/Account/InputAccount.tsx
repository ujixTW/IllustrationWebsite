import style from "../../assets/CSS/components/Account/Input.module.css";
export default function InputAccount(props: {
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
      name="account"
      className={style["input-text"]}
      autoComplete="username"
      autoCapitalize="off"
      value={props.value}
      onChange={props.onChange}
    />
  );
}
