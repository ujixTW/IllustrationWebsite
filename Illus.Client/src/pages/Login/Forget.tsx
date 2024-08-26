import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/Login/Forget.module.css";
import InputEmail from "../../components/Account/InputEmail";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import { SureBtn } from "../../components/Account/Button";
import { emailReg, guidReg } from "../../utils/regexHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import path from "../../data/JSON/path.json";

enum stepEnum {
  email = 0,
  captcha = 1,
}

function Forget() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [step, setStep] = useState<stepEnum>(stepEnum.email);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState<string>("");

  useEffect(() => {
    switch (step) {
      case stepEnum.email:
        setEmail("");
        setError(false);
        break;
      case stepEnum.captcha:
        setCaptcha("");
        setError(false);
        break;
    }
  }, [step]);

  const submitCaptcha = () => {
    if (guidReg.test(captcha)) {
      axios
        .get(`/api/EditAccount/Email/${email}`, {
          params: { CAPTCHA: captcha },
        })
        .then(() => {
          navigate(`${path.login.resetPwd + email}?captcha=${captcha}`);
        })
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  };

  const submitEmail = () => {
    if (emailReg.test(email)) {
      axios
        .get(`/api/EditAccount/ForgetPassword/${email}`)
        .then((res) => {
          const data: boolean = res.data;
          if (data) {
            setStep(stepEnum.captcha);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true));
    } else {
      setError(true);
    }
  };
  const handleClick = () => {
    switch (step) {
      case stepEnum.email:
        return submitEmail;
      case stepEnum.captcha:
        return submitCaptcha;
      default:
        return () => {};
    }
  };

  return (
    <div>
      <h1 className={style["title"]}>重置密碼</h1>
      <h3 className={style["sub-title"]}>
        {step == stepEnum.email
          ? "請輸入信箱地址"
          : step == stepEnum.captcha
          ? "請輸入驗證碼"
          : ""}
      </h3>
      {error && <p className={style["error"]}>格式錯誤！</p>}
      <div className={style["input"]}>
        {step == stepEnum.email ? (
          <InputEmail
            value={email}
            onChange={(e: ChangeEvent) => setEmail(e.target.value)}
          />
        ) : step == stepEnum.captcha ? (
          <InputEmail
            value={captcha}
            onChange={(e: ChangeEvent) => setCaptcha(e.target.value)}
          />
        ) : (
          <></>
        )}
      </div>

      <div className={style["btn"]}>
        <SureBtn text="發送" onClick={handleClick} />
      </div>
    </div>
  );
}
export default Forget;
