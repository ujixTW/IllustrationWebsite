import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "../../assets/CSS/components/User/CoverEditor.module.css";
import EditSvg from "../../assets/SVG/edit.svg?react";
import DeleteSvg from "../../assets/SVG/delete.svg?react";
import ImgCutter from "../ImgCutter";
import {
  ImagePathHelper,
  ImagePathUrlToFile,
} from "../../utils/ImagePathHelper";
import axios from "axios";
import Loading from "../Loading";
import { SureBtn } from "../Button/BasicButton";
import { ChangeEvent } from "../../utils/tsTypesHelper";

function CoverEditor(props: { imgUrl: string; isOwn?: boolean }) {
  const [isEdit, setIsEdit] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File>();
  const [editFile, setEditFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCover, setHasCover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.isOwn) return setCoverUrl(props.imgUrl);

    const url = ImagePathHelper(props.imgUrl);
    setCoverUrl(url);
    ImagePathUrlToFile(url, "cover").then((res) => {
      if (res) setCoverFile(res);
    });
  }, [props.imgUrl]);
  useEffect(() => {
    setHasCover(coverUrl.trim() !== "");
  }, [coverUrl]);

  useEffect(() => {
    if (!props.isOwn) return;

    URL.revokeObjectURL(coverUrl);
    setCoverUrl(coverFile ? URL.createObjectURL(coverFile) : "");
    setEditFile(coverFile);
    return () => {
      URL.revokeObjectURL(coverUrl);
    };
  }, [coverFile]);

  const handleEdit = useCallback(async (_img?: File) => {
    setIsLoading(true);

    await axios
      .post("/api/EditAccount/UserCover", _img)
      .then(() => {
        setCoverFile(_img);
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
    <div
      className={
        style["container"] + " " + style[hasCover ? "has-data" : "no-data"]
      }
      style={{ backgroundImage: `url("${coverUrl}")` }}
    >
      {isLoading && <Loading />}
      {props.isOwn && (
        <div className={style["option"]}>
          {!hasCover && (
            <div
              className={style["no-data-message"]}
              onClick={() => setIsEdit(true)}
            >
              <EditSvg className={style["edit-icon"]} />
              <div>快來設定封面，製作專屬的個人封面吧</div>
            </div>
          )}
          <div className={style["btn-container"]}>
            <button
              type="button"
              name="editCover"
              className={style["btn"]}
              onClick={() => setIsEdit(true)}
            >
              <EditSvg />
            </button>
            {hasCover && (
              <button
                type="button"
                name="deleteCover"
                className={style["btn"]}
                onClick={() => handleEdit()}
              >
                <DeleteSvg />
              </button>
            )}
          </div>
        </div>
      )}
      {!props.isOwn && !hasCover && (
        <div className={style["artist-no-cover"]}></div>
      )}

      {isEdit && (
        <ImgCutter
          type="rect"
          img={editFile}
          title="封面設定"
          aspect={2}
          archiveSize={{ width: 1280, height: 640 }}
          setCuttingImg={(_img?: File) => handleEdit(_img)}
          closeFnc={() => {
            setEditFile(coverFile);
            setIsEdit(false);
          }}
          editBoxSize={{ width: 440, height: 220 }}
        >
          <div className={style["img-cutter"]}>
            <input
              type="file"
              name="coverInput"
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
              <div className={style["info"]}>
                <div className={style["title"]}>推薦長寬比</div>
                <div className={style["value"]}>2:1</div>
              </div>
            </div>
          </div>
        </ImgCutter>
      )}
    </div>
  );
}
export default memo(CoverEditor);
