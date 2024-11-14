import style from "../../assets/CSS/components/Account/Input.module.css";
export default function InputAccount(props: {
  id?: string;
  value: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
}) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      id={props.id}
      name="account"
      className={style["input-text"]}
      autoComplete={props.autoComplete}
      autoCapitalize="off"
      value={props.value}
      onChange={props.onChange}
    />
  );
}
