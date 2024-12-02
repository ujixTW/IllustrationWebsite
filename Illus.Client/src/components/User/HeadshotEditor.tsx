import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "../../assets/CSS/components/User/HeadshotEditor.module.css";
import EditSvg from "../../assets/SVG/edit.svg?react";
import Loading from "../Loading";
import ImgCutter from "../ImgCutter";
import { SureBtn } from "../Button/BasicButton";
import { ChangeEvent } from "../../utils/tsTypesHelper";
import axios from "axios";
import {
  ImagePathHelper,
  ImagePathUrlToFile,
  IsDefaultImg,
} from "../../utils/ImagePathHelper";
import { userHeadshotHelper } from "../../utils/fromBackEndDataHelper";
import { getFormFileHelper } from "../../utils/formDataHelper";

function HeadshotEditor(props: {
  headshotUrl: string;
  isOwn: boolean;
  offsetY?: string;
}) {
  const [imgUrl, setImgUrl] = useState("");
  const [headshotFile, setHeadshotFile] = useState<File>();
  const [editFile, setEditFile] = useState<File>();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.isOwn) return setImgUrl(props.headshotUrl);

    const notDefault = !IsDefaultImg(props.headshotUrl);
    const url = notDefault
      ? ImagePathHelper(props.headshotUrl)
      : props.headshotUrl;

    setImgUrl(url);
    if (notDefault)
      ImagePathUrlToFile(url, "cover").then((res) => {
        if (res) setHeadshotFile(res);
      });
  }, [props.headshotUrl]);

  useEffect(() => {
    if (!props.isOwn) return;

    URL.revokeObjectURL(imgUrl);
    setImgUrl(
      headshotFile ? URL.createObjectURL(headshotFile) : userHeadshotHelper("")
    );
    setEditFile(headshotFile);
    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [headshotFile]);

  const handleEdit = useCallback(async (_img?: File) => {
    setIsLoading(true);
    const _formData = getFormFileHelper(_img);

    await axios
      .post("/api/EditAccount/UserHeadshot", _formData)
      .then(() => {
        setHeadshotFile(_img);
        setIsEdit(false);
      })
      .catch(() => alert("修改失敗，請稍後再試"));
    setIsLoading(false);
  }, []);

  const handleInputClick = useCallback((e: ChangeEvent) => {
    e.preventDefault();
    const _file = e.target.files;
    if (_file && _file.length === 1) {
      setEditFile(_file[0]);
    }
  }, []);

  return (
    <>
      <div
        className={style["headshot"]}
        style={{ transform: `translateY(${props.offsetY})` }}
      >
        <img src={imgUrl} alt="headshot" className={style["img"]} />
        {props.isOwn && (
          <button
            type="button"
            name="editHeadshotBtn"
            className={style["edit-btn"]}
            onClick={() => setIsEdit(true)}
          >
            <EditSvg />
          </button>
        )}
      </div>
      {isEdit && (
        <ImgCutter
          type="round"
          img={editFile}
          title="頭像設定"
          aspect={1}
          archiveSize={{ width: 220, height: 220 }}
          setCuttingImg={(_img?: File) => handleEdit(_img)}
          closeFnc={() => {
            setEditFile(headshotFile);
            setIsEdit(false);
          }}
          editBoxSize={{ width: 220, height: 220 }}
        >
          <div className={style["img-cutter"]}>
            <input
              type="file"
              name="headshotInput"
              accept="image/gif,image/jpeg,image/png"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={handleInputClick}
            />
            <div className={style["upload-btn"]}>
              <SureBtn
                text="選擇圖片"
                onClick={() => {
                  if (inputRef.current) inputRef.current.click();
                }}
              />
            </div>
            <div className={style["info-container"]}>
              <div className={style["info"]}>
                <div className={style["title"]}>適用檔案</div>
                <div className={style["value"]}>JPEG / PNG</div>
              </div>
            </div>
          </div>
        </ImgCutter>
      )}
      {isLoading && <Loading />}
    </>
  );
}

export default memo(HeadshotEditor);
