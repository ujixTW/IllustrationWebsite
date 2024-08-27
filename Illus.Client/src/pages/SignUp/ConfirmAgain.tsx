import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guidReg } from "../../utils/regexHelper";
import path from "../../data/JSON/path.json";
import axios from "axios";
import changeWebTitle from "../../utils/changeWebTitle";

function ConfirmAgain() {
  const [fail, setFail] = useState<boolean>(false);
  const { captcha } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    changeWebTitle("驗證信寄送 | ");

    if (captcha != undefined && guidReg.test(captcha)) {
      axios
        .get(`/api/SignUp/confirmAgain/${captcha}`)
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
      <h1>{fail ? "寄送失敗" : "已成功寄送驗證信"}</h1>
    </div>
  );
}
export default ConfirmAgain;
