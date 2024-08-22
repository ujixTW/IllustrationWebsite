import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guidReg } from "../../utils/regexHelper";
import path from "../../data/JSON/path.json";
import { SureBtn } from "../../components/Account/Button";
import style from "../../assets/CSS/pages/signUp/Confirm.module.css";

function Confirm() {
  const [fail, setFail] = useState<boolean>(true);
  const { captcha } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (captcha != undefined && guidReg.test(captcha)) {
      axios
        .get(`/api/SignUp/${captcha}`)
        .then((res) => {
          const success: boolean = res.data;
          setFail(!success);
        })
        .catch((err) => console.log(err));
    } else {
      navigate(path.home);
    }
  }, []);

  return (
    <div>
      <h1>{fail ? "過期或無效的連結" : "註冊成功！"}</h1>
      <div className={style["home-btn"]}>
        <SureBtn text="回首頁" onClick={() => navigate(path.home)} />
      </div>
    </div>
  );
}

export default Confirm;
