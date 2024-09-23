import { useParams } from "react-router-dom";
import style from "../../../assets/CSS/components/artwork/Command/CommandList.module.css";
import Command from "./Command";
import { useEffect, useState } from "react";
import { MessageType } from "../../../data/typeModels/message";
import { MoreBtn, SureBtn } from "../../Button/BasicButton";
import axios from "axios";
import AutoSizeTextArea from "../../AutoSizeTextArea";
import { ChangeTextareaEvent } from "../../../utils/tsTypesHelper";
import { htmlReg } from "../../../utils/regexHelper";
import { useAppSelector } from "../../../hooks/redux";
import { CommandPostData } from "../../../data/postData/artwork";
function CommandList() {
  const { artworkId } = useParams();
  const headshot = useAppSelector((state) => state.userData.headshot);
  const [commandArr, setCommandArr] = useState<MessageType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const pageCount = 10;
  const today = new Date();

  useEffect(() => {
    handleGetCommand();
  }, []);

  const handleGetCommand = async (lastId?: number) => {
    await axios
      .get(`/api/Message/${artworkId}`, {
        params: lastId
          ? {
              lastId: lastId,
              pageCount: pageCount,
            }
          : { pageCount: pageCount },
      })
      .then((res) => {
        const data: MessageType[] = res.data;
        if (data.length < pageCount) setHasMore(true);
        if (lastId) {
          const copyList = [...commandArr];
          copyList.push(...data);
          setCommandArr(copyList);
        } else {
          setCommandArr(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async () => {
    if (inputCommand.replace(htmlReg, "").trim() == "") return;
    if (artworkId) {
      const postData: CommandPostData = {
        id: -1,
        workId: parseInt(artworkId),
        message: inputCommand,
      };
      await axios
        .post(`/api/Message/Write`, postData)
        .then(() => handleGetCommand())
        .catch(() => alert("留言失敗，請稍後再試"));
    }
  };
  const list = commandArr.map((c) => (
    <Command key={c.id} command={c} today={today} />
  ));

  return (
    <div className={style["body"]}>
      <div className={style["header"]}>
        <h1 className={style["title"]}>留言</h1>
        <div className={style["input-container"]}>
          <div className={style["start"]}>
            <div className={style["headshot"]}>
              <img src={headshot} alt="User headshot" />
            </div>
          </div>
          <div className={style["middle"]}>
            <div className={style["input"]}>
              <AutoSizeTextArea
                value={inputCommand}
                onChange={(e: ChangeTextareaEvent) =>
                  setInputCommand(e.target.value)
                }
                placeholder="發表留言"
              />
            </div>
          </div>
          <div className={style["end"]}>
            <div className={style["submit"]}>
              <SureBtn
                text="發送"
                onClick={handleSubmit}
                disabled={!(inputCommand.replace(htmlReg, "").trim() != "")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style["command-list"]}>
        {commandArr.length > 0 ? (
          list
        ) : (
          <p className={style["no-data"]}>暫無留言</p>
        )}
        {hasMore && (
          <div className={style["more"]}>
            <MoreBtn
              text="瀏覽更多"
              onClick={() =>
                handleGetCommand(commandArr[commandArr.length - 1].id)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default CommandList;
