import { useEffect, useState } from "react";
import style from "../../assets/CSS/pages/User/Settings.module.css";
import path from "../../data/JSON/path.json";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { MoreBtn, SureBtn } from "../../components/Button/BasicButton";
import InputAccount from "../../components/Account/InputAccount";
import InputEmail from "../../components/Account/InputEmail";
import InputPassword from "../../components/Account/InputPassword";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import { signUpError } from "../../data/typeModels/signUpResult";
import { editPasswordPostData } from "../../data/postData/account";
import useUnSavedChange from "../../hooks/useUnsavedChange";
import { accountReg, emailReg, passwordReg } from "../../utils/regexHelper";
import axios from "axios";
import changeWebTitle from "../../utils/changeWebTitle";
import { userDataActions } from "../../data/reduxModels/userDataRedux";

enum inputType {
  account,
  email,
  password,
}
function AccountInfo(props: {
  type: inputType;
  infoValue: string;
  isConfirmed?: boolean;
  setIsDirty: (_val: boolean) => void;
  setUserData?: (_data: string) => void;
}) {
  const [value, setValue] = useState("");
  const [valueOld, setValueOld] = useState("");
  const [valueCheck, setValueCheck] = useState("");
  const [errText, setErrText] = useState("");
  const [error, setError] = useState<signUpError>(signUpError.none);
  const [isEdit, setIsEdit] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setValue("");
      setValueOld("");
      setValueCheck("");
      setErrText("");
      setError(signUpError.none);
    }
  }, [isEdit]);
  useEffect(() => {
    const [valueTrim, valueOldTrim, valueCheckTrim] = [
      value.trim(),
      valueOld.trim(),
      valueCheck.trim(),
    ];
    const isDirty =
      valueTrim !== "" || valueOldTrim !== "" || valueCheckTrim !== "";
    props.setIsDirty(isDirty);

    switch (props.type) {
      case inputType.account:
      case inputType.email:
        setIsDisable(props.infoValue === valueTrim || valueTrim === "");
        break;
      case inputType.password:
        setIsDisable(
          valueTrim === "" || valueOldTrim === "" || valueCheckTrim === ""
        );
        break;
    }
  }, [value, valueOld, valueCheck]);

  const handleEdit = async () => {
    switch (props.type) {
      case inputType.account:
        await handleEditAcc();
        break;
      case inputType.email:
        await handleEditAcc(true);
        break;
      case inputType.password:
        await handleEditPwd();
        break;
      default:
        throw new Error("Wrong input type");
    }
  };
  const handleEditAcc = async (isEmail?: boolean) => {
    const _val = value.trim();
    if ((isEmail && emailReg.test(_val)) || accountReg.test(_val)) {
      await axios
        .post(
          `/api/EditAccount/${isEmail ? "Email" : "Account"}?${
            isEmail ? "email" : "account"
          }Commend=${value}`
        )
        .then((res) => {
          const data = res.data as boolean;
          if (data) {
            if (props.setUserData) props.setUserData(_val);
            setIsEdit(false);
          } else {
            setError(signUpError.duplicate);
            setErrText(`重複的${isEmail ? "信箱" : "帳號"}`);
          }
        })
        .catch(() => alert("通訊錯誤，請稍後再試"));
    } else {
      setError(signUpError.format);
      setErrText("格式錯誤");
    }
  };
  const handleEditPwd = async () => {
    const _val = value.trim();
    const _valOld = valueOld.trim();
    const _valCheck = valueCheck.trim();

    if (!passwordReg.test(_valOld)) {
      setError(signUpError.oldWrong);
      setErrText("密碼錯誤，請確認後再試一次");
      return;
    }
    if (_val !== _valCheck) {
      setError(signUpError.notSame);
      setErrText("輸入的新密碼不一致");
      return;
    }
    if (passwordReg.test(_val)) {
      const postData: editPasswordPostData = {
        oldPWD: _valOld,
        newPWD: _val,
        newPWDAgain: _valCheck,
      };
      await axios
        .post("/api/EditAccount/Password", postData)
        .then(() => {
          setIsEdit(false);
        })
        .catch(() => {
          setError(signUpError.oldWrong);
          setErrText("密碼錯誤，請確認後再試一次");
        });
    } else {
      setError(signUpError.format);
      setErrText("新密碼的格式錯誤");
    }
  };

  return (
    <div className={style["opt-content"]}>
      {isEdit ? (
        <div className={style["edit"]}>
          <div>
            {props.type === inputType.account && (
              <div
                className={
                  style["input"] +
                  (error !== signUpError.none ? " " + style["err"] : "")
                }
              >
                <InputAccount
                  value={value}
                  placeholder="帳號"
                  onChange={(e: ChangeEvent) => setValue(e.target.value)}
                />
              </div>
            )}
            {props.type === inputType.email && (
              <div
                className={
                  style["input"] +
                  (error !== signUpError.none ? " " + style["err"] : "")
                }
              >
                <InputEmail
                  value={value}
                  onChange={(e: ChangeEvent) => setValue(e.target.value)}
                />
              </div>
            )}
            {props.type === inputType.password && (
              <>
                <div
                  className={
                    style["input"] +
                    (error === signUpError.oldWrong ? " " + style["err"] : "")
                  }
                >
                  <InputPassword
                    value={valueOld}
                    onChange={(e: ChangeEvent) => setValueOld(e.target.value)}
                  />
                </div>
                <div
                  className={
                    style["input"] +
                    (error === signUpError.format ||
                    error === signUpError.notSame
                      ? " " + style["err"]
                      : "")
                  }
                >
                  <InputPassword
                    value={value}
                    onChange={(e: ChangeEvent) => setValue(e.target.value)}
                    isNew
                  />
                </div>
                <div
                  className={
                    style["input"] +
                    (error === signUpError.notSame ? " " + style["err"] : "")
                  }
                >
                  <InputPassword
                    value={valueCheck}
                    onChange={(e: ChangeEvent) => setValueCheck(e.target.value)}
                    isNew
                    isSec
                  />
                </div>
              </>
            )}
            <div className={style["tip"]}>
              {error !== signUpError.none && (
                <p className={style["err"]}>{errText}</p>
              )}

              {props.type === inputType.account && (
                <p>請輸入6-16字不含特殊符號之半形英數字組合。</p>
              )}

              {props.type === inputType.password && (
                <div>
                  <p>
                    請輸入6-32字密碼。
                    <br />
                    至少需包含各一個大寫字母、小寫字母及數字。
                    <br />
                    可使用特殊符號以增強密碼強度。
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={style["btn-container"]}>
            <div className={style["btn"]}>
              <MoreBtn
                text="取消"
                onClick={() => {
                  setValue("");
                  if (props.type === inputType.password) {
                    setValueOld("");
                    setValueCheck("");
                  }
                  setError(signUpError.none);
                  setIsEdit(false);
                }}
              />
            </div>
            <div className={style["btn"]}>
              <SureBtn text="確定" onClick={handleEdit} disabled={isDisable} />
            </div>
          </div>
        </div>
      ) : (
        <div className={style["show"]}>
          <p className={style["content"]}>{props.infoValue}</p>
          <div className={style["tip"]}>
            {props.type === inputType.email && (
              <p
                className={props.isConfirmed ? style["success"] : style["err"]}
              >
                {props.isConfirmed ? "已" : "未"}驗證
              </p>
            )}
          </div>
          <div className={style["btn"]}>
            <MoreBtn text="修改" onClick={() => setIsEdit(true)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() {
  const isLogin = useAppSelector((state) => state.login);
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  const [hasValue, setHasValue] = useState({
    account: false,
    email: false,
    password: false,
  });
  const { setIsDirty, CheckUnsavedToLeaveModal } = useUnSavedChange();

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isLogin || !id || parseInt(id) !== userData.id)
      return navigate(path.home);

    changeWebTitle("設定 - ");
  }, []);
  useEffect(() => {
    const isDirty = hasValue.account || hasValue.email || hasValue.password;
    setIsDirty(isDirty);
  }, [hasValue]);

  return (
    <div className={style["body"]}>
      <div className={style["main"]}>
        <h1 className={style["p-title"]}>帳號設定</h1>
        <div className={style["option-container"]}>
          <div className={style["option"]}>
            <div className={style["opt-title"]}>帳號</div>
            <AccountInfo
              type={inputType.account}
              infoValue={userData.account}
              setIsDirty={(_val: boolean) => {
                const copyObj = Object.assign({}, hasValue);
                copyObj.account = _val;
                setHasValue(copyObj);
              }}
              setUserData={(_data: string) => {
                const copyObj = Object.assign({}, userData);
                copyObj.account = _data;
                dispatch(userDataActions.setUserData(copyObj));
              }}
            />
          </div>
          <div className={style["option"]}>
            <div className={style["opt-title"]}>信箱</div>
            <AccountInfo
              type={inputType.email}
              infoValue={userData.email}
              setIsDirty={(_val: boolean) => {
                const copyObj = Object.assign({}, hasValue);
                copyObj.email = _val;
                setHasValue(copyObj);
              }}
              setUserData={(_data: string) => {
                const copyObj = Object.assign({}, userData);
                copyObj.email = _data;
                copyObj.emailConfirm = false;
                dispatch(userDataActions.setUserData(copyObj));
              }}
              isConfirmed={userData.emailConfirm}
            />
          </div>
          <div className={style["option"]}>
            <div className={style["opt-title"]}>密碼</div>
            <AccountInfo
              type={inputType.password}
              infoValue="******"
              setIsDirty={(_val: boolean) => {
                const copyObj = Object.assign({}, hasValue);
                copyObj.password = _val;
                setHasValue(copyObj);
              }}
            />
          </div>
        </div>
        {CheckUnsavedToLeaveModal}
      </div>
    </div>
  );
}

export default Settings;
