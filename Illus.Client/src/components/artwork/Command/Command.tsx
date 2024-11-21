import { memo, useCallback, useEffect, useState } from "react";
import style from "../../../assets/CSS/components/artwork/Command/Command.module.css";
import ThreeDot from "../../../assets/SVG/threeDot.svg?react";
import path from "../../../data/JSON/path.json";
import { MessageType } from "../../../data/typeModels/message";
import { userHeadshotHelper } from "../../../utils/fromBackEndDataHelper";
import DropDown from "../../DropDown";
import { useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";
import { ChangeTextareaEvent } from "../../../utils/tsTypesHelper";
import { CancelBtn, NormalBtn, SureBtn } from "../../Button/BasicButton";
import axios from "axios";
import JumpWindow from "../../JumpWindow";
import { htmlReg } from "../../../utils/regexHelper";
import { CommandPostData } from "../../../data/postData/artwork";
import AutoSizeTextArea from "../../AutoSizeTextArea";

function Command(props: { command: MessageType; today: Date }) {
  const { command, today } = props;
  const [showOpt, setShowOpt] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsdelete] = useState(false);
  const [editText, setEditText] = useState("");
  const [message, setMessage] = useState(command.message);
  const userId = useAppSelector((state) => state.userData.id);
  const time = command.createTime;
  const timeStr =
    today.getFullYear() > time.getFullYear()
      ? `${today.getFullYear() - time.getFullYear()}年前`
      : `${time.getMonth() + 1}月${time.getDate()}日`;

  useEffect(() => {
    if (command.userId == userId) setIsOwn(true);
  }, []);
  useEffect(() => {
    if (isEdit) setEditText(message);
  }, [isEdit]);
  const handleDlete = useCallback(async () => {
    await axios
      .post(`/api/Message/Delete/${command.id}`)
      .then(() => {
        setMessage("(--- 留言已刪除 ---)");
        setIsOwn(false);
      })
      .catch(() => {
        alert("刪除失敗");
      });
  }, [command]);
  const handleEditSure = useCallback(async () => {
    if (editText.trim() == "") return;
    setIsEdit(false);
    let textCopy = editText.replace(htmlReg, "").trim();
    if (textCopy != "") {
      const postData: CommandPostData = {
        id: command.id,
        workId: command.workId,
        message: textCopy,
      };
      await axios
        .post(`/api/Message/Edit`, postData)
        .then(() => {
          setMessage(textCopy);
        })
        .catch(() => {
          alert("修改失敗!請稍後再試");
        });
    }
  }, [command]);
  const handleCancle = () => {
    setIsEdit(false);
  };

  return (
    <div className={style["command-container"]}>
      <div className={style["start"]}>
        <div className={style["headshot"]}>
          <Link className={style["link"]} to={path.user.user + command.userId}>
            <img
              src={userHeadshotHelper(command.userHeadshot)}
              alt={`${command.userNickName}`}
            />
          </Link>
        </div>
      </div>
      <div className={style["center"]}>
        <div className={style["data"]}>
          <p className={style["name"]}>{command.userNickName}</p>
        </div>
        {isEdit ? (
          <div className={style["edit"]}>
            <AutoSizeTextArea
              value={editText}
              onChange={(e: ChangeTextareaEvent) => setEditText(e.target.value)}
              placeholder="留言內容不可為空"
            />
          </div>
        ) : (
          <div className={style["command"]}>{message}</div>
        )}
        <div className={style["data"]}>
          <p className={style["sub"]}>{timeStr}</p>
          {(command.isEdit || command.message != message) && (
            <p className={style["sub"]}>{"(已編輯)"}</p>
          )}
        </div>
      </div>
      <div className={style["end"]}>
        <div className={style["option"]}>
          {isOwn && !isEdit && (
            <button
              type="button"
              className={style["opt-btn"]}
              onClick={async () => await setTimeout(() => setShowOpt(true), 0)}
            >
              <ThreeDot />
            </button>
          )}
          {isEdit && (
            <div className={style["edit-option"]}>
              <div className={style["btn"]}>
                <SureBtn
                  text="完成"
                  onClick={handleEditSure}
                  disabled={!(editText.replace(htmlReg, "").trim() != "")}
                />
              </div>
              <div className={style["btn"]}>
                <NormalBtn text="取消" onClick={handleCancle} />
              </div>
            </div>
          )}
          {showOpt && (
            <DropDown closeFnc={() => setShowOpt(false)} down>
              <ul className={style["opt-list"]}>
                <li
                  onClick={() => {
                    setShowOpt(false);
                    setIsEdit(true);
                  }}
                >
                  編輯
                </li>
                <li
                  onClick={() => {
                    setShowOpt(false);
                    setIsdelete(true);
                  }}
                >
                  刪除
                </li>
              </ul>
            </DropDown>
          )}
          {isDelete && (
            <JumpWindow closeFnc={() => setIsdelete(false)}>
              <div className={style["delete-check"]}>
                <h1 className={style["title"]}>確定要刪除留言嗎?</h1>
                <div className={style["btn-container"]}>
                  <div className={style["btn"]}>
                    <CancelBtn text="刪除" onClick={handleDlete} />
                  </div>
                  <div className={style["btn"]}>
                    <NormalBtn text="取消" onClick={() => setIsdelete(false)} />
                  </div>
                </div>
              </div>
            </JumpWindow>
          )}
        </div>
      </div>
    </div>
  );
}
export default memo(Command);
