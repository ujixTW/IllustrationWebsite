import { useEffect, useState } from "react";
import style from "../assets/CSS/components/ImgCutter.module.css";
import Cropper, { Area } from "react-easy-crop";
import { ChangeEvent } from "../utils/tsTypesHelper";
import JumpWindow from "./JumpWindow";
import { NormalBtn, SureBtn } from "./Button/BasicButton";
import { getCroppedImgFromFile } from "../utils/cnavasHelper";
import DefaultRange from "./Range";

type cutType = "rect" | "round";

function ImgCutter(props: {
  img?: File;
  type: cutType;
  aspect: number;
  archiveSize: { width: number; height: number };
  setCuttingImg: (_img: File) => void;
  closeFnc: (...args: any[]) => any;
  editBoxSize: { width: number; height: number };
  title: string;
  children?: JSX.Element;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixel, setCropAreaPixel] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    if (props.img) {
      setSelectedImg(URL.createObjectURL(props.img));
    }

    return () => {
      URL.revokeObjectURL(selectedImg);
    };
  }, []);

  const onCropChange = (crop: typeof pos) => {
    setPos(crop);
  };
  const onCropComplete = (croppedArea: Area, croppedAreaPixel: Area) => {
    setCropAreaPixel(croppedAreaPixel);
  };
  const onZoomChange = (zom: typeof zoom) => {
    setZoom(zom);
  };

  const handleSure = async () => {
    if (props.img) {
      const tempCover = await getCroppedImgFromFile(
        props.img,
        croppedAreaPixel,
        {
          width: props.archiveSize.width,
          height: props.archiveSize.height,
        }
      );
      if (tempCover) props.setCuttingImg(tempCover);
    }
    props.closeFnc();
  };
  const handlecancel = () => {
    props.closeFnc();
  };

  return (
    <JumpWindow closeFnc={props.closeFnc}>
      <div className={style["img-cutter"]}>
        <h1 className={style["title"]}>{props.title}</h1>
        <div className={style["img"]}>
          <div className={style["preview"]}>
            <div
              className={style["crop"]}
              style={{
                width: props.editBoxSize.width,
                height: props.editBoxSize.height,
              }}
            >
              <Cropper
                image={selectedImg}
                crop={pos}
                zoom={zoom}
                aspect={props.aspect}
                cropShape={props.type}
                showGrid={false}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                onZoomChange={onZoomChange}
              />
            </div>
            <div className={style["controls"]}>
              <div className={style["size"]}>
                <DefaultRange
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  name="croppedSize"
                  onChange={(e: ChangeEvent) =>
                    onZoomChange(parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {props.children}

        <div className={style["controls-container"]}>
          <div className={style["btn"]}>
            <SureBtn text="確定" onClick={handleSure} />
          </div>
          <div className={style["btn"]}>
            <NormalBtn text="取消" onClick={handlecancel} />
          </div>
        </div>
      </div>
    </JumpWindow>
  );
}

export default ImgCutter;
