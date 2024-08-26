import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { emailReg, guidReg, passwordReg } from "../../utils/regexHelper";
import path from "../../data/JSON/path.json";
import style from "../../assets/CSS/pages/Login/ResetPwd.module.css";
import { signUpError } from "../../data/typeModels/signUpResult";
import InputPassword from "../../components/Account/InputPassword";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import { SureBtn } from "../../components/Account/Button";
import axios from "axios";
import {
  editPWDFromEmailPostData,
  editPasswordPostData,
} from "../../data/postData/account";

function SuccessPage() {
  return (
    <div>
      <h1 className={style["title"]}>修改成功！</h1>
      <div>
        <div className={style["btn"]}>
          <Link to={path.home} className={style["linkBtn"]}>
            點此回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResetPage(props: {
  setSuccess: (value: React.SetStateAction<boolean>) => void;
}) {
  const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [captcha, setCaptcha] = useState<string>("");
  const [error, setError] = useState<signUpError>(signUpError.none);
  const [pwd, setPwd] = useState<string>("");
  const [pwdSec, setPwdSec] = useState<string>("");
  const [pwdId, pwdSecId] = ["pwdId", "pwdSecId"];
  useEffect(() => {
    if (
      email != undefined &&
      emailReg.test(email) &&
      location.search.search(/captcha=/) != -1
    ) {
      const search = location.search.substring(1).split("&");
      const value = search
        .filter((qs) => qs.search(/^captcha=/) == 0)[0]
        .split("=")[1];
      if (guidReg.test(value)) {
        setCaptcha(value);
      } else {
        navigate(path.home);
      }
    } else {
        navigate(path.home);
    }
  }, []);

  const checkPwd = (): boolean => {
    if (!passwordReg.test(pwd)) {
      setError(signUpError.format);
    } else if (pwd != pwdSec) {
      setError(signUpError.duplicate);
    } else {
      setError(signUpError.none);
      return true;
    }
    return false;
  };
  const handleClick = async () => {
    if (checkPwd() && email != undefined) {
      const pwdData: editPasswordPostData = {
        oldPWD: "",
        newPWD: pwd,
        newPWDAgain: pwdSec,
      };
      const data: editPWDFromEmailPostData = {
        email: email,
        CAPTCHA: captcha,
        passwordCommand: pwdData,
      };
      await axios
        .post("/api/EditAccount/ForgetPassword", data)
        .then(() => props.setSuccess(true))
        .catch(() => setError(signUpError.format));
    }
  };

  return (
    <div>
      <h1 className={style["title"]}>重置密碼</h1>

      <div className={style["input"]}>
        <label htmlFor={pwdId}>
          請輸入新密碼：
          {error == signUpError.format && (
            <span className={style["error"]}>格式錯誤！</span>
          )}
        </label>
        <InputPassword
          id={pwdId}
          isNew
          value={pwd}
          onChange={(e: ChangeEvent) => setPwd(e.target.value)}
        />

        <label htmlFor={pwdSecId}>
          請再次輸入密碼：
          {error == signUpError.duplicate && (
            <span className={style["error"]}>請填入與上方相同的密碼！</span>
          )}
        </label>
        <InputPassword
          id={pwdSecId}
          isNew
          isSec
          value={pwdSec}
          onChange={(e: ChangeEvent) => setPwdSec(e.target.value)}
        />
      </div>

      <div className={style["btn"]}>
        <SureBtn text="發送" onClick={handleClick} />
      </div>
    </div>
  );
}
function ResetPwd() {
  const [success, setSuccess] = useState<boolean>(false);

  return success ? <SuccessPage /> : <ResetPage setSuccess={setSuccess} />;
}
export default ResetPwd;
