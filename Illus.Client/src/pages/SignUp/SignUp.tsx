import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/signUp/SignUp.module.css";
import InputAccount from "../../components/Account/InputAccount";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import InputEmail from "../../components/Account/InputEmail";
import InputPassword from "../../components/Account/InputPassword";
import { SureBtn } from "../../components/Account/Button";
import { accountReg, emailReg, passwordReg } from "../../utils/regexHelper";
import axios from "axios";
import { loginPostData } from "../../data/postData/account";
import {
  signUpError,
  signUpResultType,
} from "../../data/typeModels/signUpResult";
import { useNavigate } from "react-router-dom";
import path from "../../data/JSON/path.json";

function SignUp() {
  const [account, setAccount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [finish, setFinish] = useState<boolean>(false);
  const [accErr, setAccErr] = useState<signUpError>(signUpError.none);
  const [pwdErr, setPwdErr] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<signUpError>(signUpError.none);
  const [serverFail, setServerFail] = useState<boolean>(false);
  const [accId, pwdId, emailId] = ["accInput", "pwdInput", "emailInput"];
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (
      !accountReg.test(account) ||
      !emailReg.test(email) ||
      !passwordReg.test(password)
    ) {
      setAccErr(
        accountReg.test(account) ? signUpError.none : signUpError.format
      );
      setEmailErr(emailReg.test(email) ? signUpError.none : signUpError.format);
      setPwdErr(passwordReg.test(password));
      return;
    }
    const data: loginPostData = {
      account: account,
      password: password,
      email: email,
    };
    await axios
      .post("/api/SignUp", data)
      .then((res) => {
        const data: signUpResultType | null = res.data;
        if (data != null) {
          setServerFail(false);
          if (data.accError > 0 || data.emailError > 0 || data.pwdError > 0) {
            setAccErr(data.accError);
            setEmailErr(data.emailError);
            setPwdErr(data.pwdError != 0);
          } else {
            navigate(path.signUp.wait);
          }
        } else {
          setServerFail(true);
        }
      })
      .catch(() => setServerFail(true));
  };
  const handleErrText = (target: string, err: signUpError) => {
    switch (err) {
      case signUpError.duplicate:
        return `已使用的${target}。`;
      case signUpError.format:
        return `${target}格式錯誤。`;
      default:
        return "";
    }
  };
  useEffect(() => {
    if (account.trim() != "" && password.trim() != "" && email.trim() != "") {
      setFinish(true);
    } else {
      setFinish(false);
    }
  }, [account, password, email]);

  return (
    <div>
      <form>
        <div className={style["item"]}>
          <div className={style["title"]}>
            <label htmlFor={accId}>帳號：</label>
            <p className={style["error"]}>{handleErrText("帳號", accErr)}</p>
          </div>
          <InputAccount
            id={accId}
            value={account}
            placeholder="帳號"
            onChange={(e: ChangeEvent) => setAccount(e.target.value)}
          />
          <div className={style["tip"]}>
            <p>請輸入6-16字不含特殊符號之半形英數字組合。</p>
          </div>
        </div>

        <div className={style["item"]}>
          <div className={style["title"]}>
            <label htmlFor={emailId}>信箱：</label>
            <p className={style["error"]}>{handleErrText("信箱", emailErr)}</p>
          </div>
          <InputEmail
            id={emailId}
            value={email}
            onChange={(e: ChangeEvent) => setEmail(e.target.value)}
          />
        </div>

        <div className={style["item"]}>
          <div className={style["title"]}>
            <label htmlFor={pwdId}>密碼：</label>
            {pwdErr && <p className={style["error"]}>密碼格式錯誤。</p>}
          </div>
          <InputPassword
            id={pwdId}
            isNew={true}
            value={password}
            onChange={(e: ChangeEvent) => setPassword(e.target.value)}
          />
          <div className={style["tip"]}>
            <p>請輸入6-32字密碼。</p>
            <p>
              至少需包含各一個大寫字母、小寫字母及數字。
              <br />
              可使用特殊符號以增強密碼強度。
            </p>
          </div>
        </div>

        {serverFail && (
          <p className={style["error"]}>伺服器錯誤，請稍後再試一次。</p>
        )}
        <div className={style["item"] + " " + style["submit"]}>
          <SureBtn disabled={!finish} text="註冊" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}
export default SignUp;
