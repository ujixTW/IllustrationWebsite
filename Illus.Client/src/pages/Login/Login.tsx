import { Link, useNavigate } from "react-router-dom";
import style from "../../assets/CSS/pages/Login.module.css";
import path from "../../data/JSON/path.json";
import InputPassword from "../../components/Account/InputPassword";
import InputAccount from "../../components/Account/InputAccount";
import { ChangeEvent, FormEvent } from "../../utils/tsTypesHelper";
import { useEffect, useState } from "react";
import axios from "axios";
import { loginPostData } from "../../data/postData/account";
import { accountReg, emailReg, passwordReg } from "../../utils/regexHelper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { loginActions } from "../../data/reduxModels/loginRedux";

function Login() {
  const [notFinish, setNotFinish] = useState<boolean>(true);
  const [accFail, setAccFail] = useState<boolean>(false);
  const [pwdFail, setPwdFail] = useState<boolean>(false);
  const [loginFail, setLoginFail] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const isLogin: boolean = useAppSelector((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) navigate(path.home);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      (!accountReg.test(account) && !emailReg.test(account)) ||
      !passwordReg.test(password)
    ) {
      setAccFail(!accountReg.test(account) && !emailReg.test(account));
      setPwdFail(!passwordReg.test(password));
      return;
    }
    const data: loginPostData = { account: "", password: "", email: "" };

    if (accountReg.test(account)) data.account = account;
    else data.email = account;
    data.password = password;

    await axios
      .post("/api/Login", data)
      .then((res) => {
        if (res.data) {
          dispatch(loginActions.login());
          navigate(path.home);
        } else {
          setLoginFail(true);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (account.trim() != "" && password.trim() != "") {
      setNotFinish(false);
    } else {
      setNotFinish(true);
    }
  }, [account, password]);

  return (
    <div className={style["content"]}>
      <form onSubmit={handleSubmit}>
        <div className={style["input"]}>
          <InputAccount
            value={account}
            onChange={(e: ChangeEvent) => setAccount(e.currentTarget.value)}
          />
          {accFail && (
            <p className={style["error"]}>信箱地址或輸入之帳號有誤。</p>
          )}
          <InputPassword
            value={password}
            onChange={(e: ChangeEvent) => setPassword(e.currentTarget.value)}
          />
          {pwdFail && (
            <p className={style["error"]}>
              請將密碼長度設於半形6字元以上32字元以下。
            </p>
          )}
        </div>
        <div className={style["forget"]}>
          <Link to={path.login.forget} className={style["forget"]}>
            忘記密碼
          </Link>
        </div>
        {loginFail && (
          <p className={style["error"]}>請確認信箱地址、帳號及密碼是否正確。</p>
        )}
        <button type="submit" className={style["submit"]} disabled={notFinish}>
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
