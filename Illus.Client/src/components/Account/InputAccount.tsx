import style from "../../assets/CSS/components/Account/Input.module.css";
export default function InputAccount(props: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <input
      type="text"
      placeholder="請輸入帳號或信箱"
      name="account"
      className={style["input-text"]}
      autoComplete="username"
      autoCapitalize="off"
      value={props.value}
      onChange={props.onChange}
    />
  );
}
