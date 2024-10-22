import { useEffect, useRef, useState } from "react";
import style from "../../../assets/CSS/pages/Artwork/Edit/ArtworkEditContainer.module.css";
import PlusSvg from "../../../assets/SVG/plus.svg?react";
import DraggingWindow from "../../../components/DraggingWindiw";
import useDragDrop from "../../../hooks/useDragDrop";
import { ArtworkPostData } from "../../../data/postData/artwork";
import { artworkPostReducerAct } from "../../../data/reducer/artworkReducer";
import { ChangeEvent, ClickDivEvent } from "../../../utils/tsTypesHelper";
import {
  getCroppedImgFromFile,
  getImgLength,
} from "../../../utils/cnavasHelper";
import { MoreBtn, SureBtn } from "../../../components/Button/BasicButton";
import ImgCutter from "../../../components/ImgCutter";

function PreviewCard(props: {
  previewUrl: string;
  onMouseDown: (...args: any[]) => void;
  cancelFnc?: (...args: any[]) => void;
}) {
  return (
    <div className={style["preview"]}>
      <img src={props.previewUrl} alt="預覽圖片" />
      <div className={style["mask"]} onMouseDown={props.onMouseDown}></div>
      {props.cancelFnc && (
        <button
          type="button"
          className={style["cancel"]}
          onClick={props.cancelFnc}
        >
          x
        </button>
      )}
    </div>
  );
}

function DragArea(props: {
  dataList: File[] | string[];
  editDataList: (_list: any[]) => void;
  addDataFnc?: (...args: any[]) => void;
  dataType: "imgFile" | "imgString";
  canRemove?: boolean;
  aloneInCenter?: boolean;
}) {
  const {
    dataList,
    editDataList,
    addDataFnc,
    dataType,
    canRemove,
    aloneInCenter,
  } = props;
  const [isOnlyClass, setIsOnlyClass] = useState("");
  const [draggingUrl, setDraggingUrl] = useState("");

  const [itemArr, setItemArr] = useState<JSX.Element[]>([]);
  const [targetArr, setTargetArr] = useState<HTMLDivElement[]>([]);

  const [dragIndex, setDragIndex] = useState(-1);
  const [targetIndex, setTargetIndex] = useState(-1);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [draggingEnd, setDraggingEnd] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const draggingItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragIndex == -1) return;
    const dragArea = areaRef.current;
    const _targetArr = dragArea
      ? ([
          ...dragArea.querySelectorAll(`div.${style["img-container"]}`),
        ] as HTMLDivElement[])
      : undefined;

    if (!dragArea || !_targetArr || !_targetArr[dragIndex]) return;

    const img = _targetArr[dragIndex];
    const imgRect = img.getBoundingClientRect();
    const imgPos = { x: imgRect.left, y: imgRect.top - window.scrollY };
    setStartPos(imgPos);
    setOffsetPos({
      x: mousePos.x - imgPos.x,
      y: mousePos.y - imgPos.y,
    });
    img.style.opacity = "0.5";

    setTargetArr(_targetArr);
    setDraggingUrl(URL.createObjectURL(dataList[dragIndex] as File));

    return () => {
      URL.revokeObjectURL(draggingUrl);
    };
  }, [dragIndex]);
  useEffect(() => {
    const isOnly = dataList.length <= 1;
    const subClass = " " + style[isOnly && aloneInCenter ? "only" : "not-only"];
    setIsOnlyClass(subClass);
    const tempList = handleGetDragItemList(subClass);

    setItemArr(tempList);

    if (targetIndex != -1) {
      handleSortItemStyleReset(dragIndex);
      handleCloseDraggingItem();
    }
  }, [dataList]);
  useEffect(() => {
    if (dragIndex == -1) return;
    handleMoveList(targetIndex);
  }, [targetIndex]);
  useEffect(() => {
    if (draggingEnd) {
      handleUp();
    }
  }, [draggingEnd]);

  const handleGetDragItemList = (subClass: string) => {
    const cancelFnc = (_index: number, _url: string) => {
      if (_url.trim() != "") URL.revokeObjectURL(_url);
      handleDeleteItem(_index);
    };

    const handleMouseDown = (e: ClickDivEvent, _index: number) => {
      e.preventDefault();
      setMousePos({ x: e.clientX, y: e.clientY });

      setDragIndex(_index);
    };
    switch (dataType) {
      case "imgFile":
        const tempImgStringArr = (dataList as File[]).map((img, index) => {
          const url = URL.createObjectURL(img);
          return (
            <div key={index} className={style["img-container"] + subClass}>
              <PreviewCard
                previewUrl={url}
                onMouseDown={(e: ClickDivEvent) => handleMouseDown(e, index)}
                cancelFnc={canRemove ? () => cancelFnc(index, url) : undefined}
              />
            </div>
          );
        });
        return tempImgStringArr;
      case "imgString":
        const tempImgStrArr = (dataList as string[]).map((url, index) => {
          return (
            <div key={index} className={style["img-container"] + subClass}>
              <PreviewCard
                previewUrl={url}
                onMouseDown={(e: ClickDivEvent) => handleMouseDown(e, index)}
                cancelFnc={canRemove ? () => cancelFnc(index, url) : undefined}
              />
            </div>
          );
        });
        return tempImgStrArr;
      default:
        throw new Error("Wrong type");
    }
  };

  const handleDeleteItem = (index: number) => {
    const tempList = [...dataList];
    tempList.splice(index, 1);

    editDataList(tempList);
  };

  const handleMove = () => {
    handleChangeTarget();
  };
  const handleUp = () => {
    const dragItem = draggingItemRef.current;
    if (dragItem) {
      const dragRect = targetArr[dragIndex].getBoundingClientRect();

      dragItem.style.position = "fixed";
      dragItem.style.left = `${dragRect.left}px`;
      dragItem.style.top = `${dragRect.top}px`;
    }
    if (targetIndex != -1) {
      const sortList = handleSortImg(dragIndex, targetIndex);
      editDataList(sortList);
    } else {
      targetArr.forEach((item) => {
        handleStyleReset(item);
      });
      handleCloseDraggingItem();
    }
  };
  const handleCloseDraggingItem = () => {
    setDraggingEnd(false);
    setDragIndex(-1);
    setDraggingUrl("");
    setTargetIndex(-1);
  };
  const handleChangeTarget = () => {
    const dragArea = areaRef.current;
    if (targetArr.length <= 1 || !draggingItemRef.current || !dragArea) return;

    const areaRect = dragArea.getBoundingClientRect();
    const areaPos = {
      sx: areaRect.left,
      sy: areaRect.top,
      ex: areaRect.right,
      ey: areaRect.bottom,
    };

    const dragRect = draggingItemRef.current.getBoundingClientRect();
    const dragPos = {
      x: (dragRect.left + dragRect.right) / 2,
      y: (dragRect.top + dragRect.bottom) / 2,
    };

    if (
      dragPos.x > areaPos.ex ||
      dragPos.x < areaPos.sx ||
      dragPos.y > areaPos.ey ||
      dragPos.y < areaPos.sy
    )
      return setTargetIndex(-1);

    const targetLength = targetArr[0].offsetHeight;
    const gap =
      targetArr[1].offsetLeft - targetArr[0].offsetLeft - targetLength;
    const col = Math.floor(dragPos.x / (targetLength + gap));
    const row = Math.floor((dragPos.y - areaPos.sy) / (targetLength + gap));

    const fullColCount =
      dragArea.scrollWidth % (targetLength + gap) < targetLength
        ? Math.floor(dragArea.scrollWidth / (targetLength + gap))
        : Math.ceil(dragArea.scrollWidth / (targetLength + gap));
    let newIndex = col < fullColCount ? row * fullColCount + col : -1;

    if (newIndex > targetArr.length - 1 || newIndex == dragIndex) newIndex = -1;

    setTargetIndex(newIndex);
  };
  const handleMoveList = (newIndex: number) => {
    const dragArea = areaRef.current;

    if (targetArr.length < 2 || !dragArea) return;

    const offset = targetArr[1].offsetLeft - targetArr[0].offsetLeft;
    const colCount =
      dragArea.scrollWidth % offset < targetArr[0].offsetWidth
        ? Math.floor(dragArea.scrollWidth / offset)
        : Math.ceil(dragArea.scrollWidth / offset);

    const originTrans = {
      x: offset * ((newIndex % colCount) - (dragIndex % colCount)),
      y:
        offset *
        (Math.floor(newIndex / colCount) - Math.floor(dragIndex / colCount)),
    };
    const dragItemStyle = targetArr[dragIndex].style;

    dragItemStyle.transform =
      newIndex == -1 ? "" : `translate(${originTrans.x}px, ${originTrans.y}px)`;

    if (newIndex == -1) {
      targetArr.forEach((item) => (item.style.transform = ""));
      return;
    }
    if (newIndex > dragIndex) {
      targetArr.forEach((item, index) => {
        const iStyle = item.style;
        if (index < dragIndex) iStyle.transform = "";
        if (index > dragIndex) {
          if (index > newIndex) iStyle.transform = "";
          else {
            const y = index % colCount != 0 ? 0 : -offset;
            const x = index % colCount == 0 ? offset * (colCount - 1) : -offset;
            iStyle.transform = `translate(${x}px, ${y}px)`;
          }
        }
      });
    } else {
      targetArr.forEach((item, index) => {
        const iStyle = item.style;
        if (index > dragIndex) iStyle.transform = "";
        if (index < dragIndex) {
          if (index < newIndex) iStyle.transform = "";
          else {
            const y = index % colCount != colCount - 1 ? 0 : offset;
            const x =
              index % colCount == colCount - 1
                ? offset * (1 - colCount)
                : offset;
            iStyle.transform = `translate(${x}px, ${y}px)`;
          }
        }
      });
    }
  };
  const handleSortItemStyleReset = async (_dragIndex: number) => {
    await setTimeout(() => {
      targetArr[_dragIndex].style.opacity = "0";
      targetArr.forEach((item, index) => {
        if (index == _dragIndex) return;
        handleStyleReset(item);
      });
      handleStyleReset(targetArr[_dragIndex]);
    }, 0);
  };

  const handleStyleReset = (item: HTMLDivElement) => {
    item.style.transform = "";
    item.style.transition = "";
    item.style.opacity = "";
  };
  const handleSortImg = (oldIndex: number, newIndex: number) => {
    const copyList = [...props.dataList];
    const copyImg = copyList[oldIndex];
    copyList.splice(oldIndex, 1);
    copyList.splice(newIndex, 0, copyImg);
    return copyList;
  };

  return (
    <div ref={areaRef} className={style["img-list-container"] + isOnlyClass}>
      {itemArr.length != 0 && (
        <>
          {itemArr}
          {addDataFnc && (
            <div
              className={style["add-more"] + isOnlyClass}
              onClick={addDataFnc}
            >
              <PlusSvg />
            </div>
          )}
        </>
      )}
      {dragIndex != -1 && draggingUrl.trim() != "" && (
        <DraggingWindow
          startPos={startPos}
          offset={offsetPos}
          onMouseMove={handleMove}
          onMouseUp={() => setDraggingEnd(true)}
        >
          <div ref={draggingItemRef} className={style["drag-img"]}>
            <div className={style["preview"]}>
              {dataType == "imgFile" || dataType == "imgString" ? (
                <img src={draggingUrl} alt="draginng item" />
              ) : (
                (dataList[dragIndex] as string)
              )}
            </div>
          </div>
        </DraggingWindow>
      )}
    </div>
  );
}

function ArtworkEditContainer(props: {
  postData: ArtworkPostData;
  postDataDispatch: React.Dispatch<artworkPostReducerAct>;
  isCreate?: boolean;
}) {
  const { postData, postDataDispatch, isCreate } = props;
  const [oldCoverBase, setOldCoverBase] = useState<File>();
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [editCover, setEditCover] = useState(false);
  const mounted = useRef(false);

  const { dropElRef, isDragging } = useDragDrop(
    isCreate
      ? (state: FileList) => {
          postDataDispatch({ type: "addImg", payload: state });
        }
      : undefined
  );

  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (oldCoverBase != postData.imgs[0] && postData.imgs.length > 0) {
      setOldCoverBase(postData.imgs[0]);
      if (mounted.current === false) {
        mounted.current = true;
        return;
      }
      setCoverImg();
    }
  }, [postData.imgs]);

  const setCoverImg = async () => {
    const imgBase = postData.imgs[0];
    const imgLength = await getImgLength(imgBase);
    const croppedLength =
      imgLength.height > imgLength.width ? imgLength.width : imgLength.height;
    const tempCover = await getCroppedImgFromFile(
      imgBase,
      { x: 0, y: 0, width: croppedLength, height: croppedLength },
      { width: 200, height: 200 }
    );
    if (tempCover) postDataDispatch({ type: "editCover", payload: tempCover });
  };

  useEffect(() => {
    if (postData.cover) {
      const coverUrl = URL.createObjectURL(postData.cover);
      setCoverPreview(coverUrl);
    }
  }, [postData.cover]);

  const handleInputImg = () => {
    if (imgInputRef.current) imgInputRef.current.click();
  };
  const handleImgInputChange = (e: ChangeEvent) => {
    e.preventDefault();
    const files = e.target.files;

    if (files && files.length > 0) {
      postDataDispatch({
        type: "editImg",
        payload: [...postData.imgs, ...files],
      });
      e.target.value = "";
    }
  };

  return (
    <div>
      <div
        className={
          style["file-container"] + (isDragging ? " " + style["dragging"] : "")
        }
      >
        <input
          type="file"
          name="file[]"
          className={style["input"]}
          multiple
          accept="image/jpg,image/jpeg,image/png"
          hidden
          ref={imgInputRef}
          onChange={handleImgInputChange}
        />
        <div className={style["input-container"]} ref={dropElRef}>
          <DragArea
            dataList={postData.imgs}
            editDataList={(_list: File[]) =>
              postDataDispatch({ type: "editImg", payload: _list })
            }
            addDataFnc={isCreate ? handleInputImg : undefined}
            dataType="imgFile"
            canRemove={isCreate}
            aloneInCenter
          />
          <div className={style["option"]}>
            {postData.imgs.length == 0 && (
              <div className={style["tip"]}>
                <div className={style["btn"]}>
                  <SureBtn
                    text="上傳檔案"
                    onClick={handleInputImg}
                    disabled={!props.isCreate}
                  />
                </div>
                <p>JPG/JPEG/PNG</p>
              </div>
            )}
            {postData.imgs.length > 0 && (
              <div className={style["cover"]}>
                <div className={style["preview"]}>
                  <img src={coverPreview} alt="cover" />
                </div>
                <div>預覽圖</div>
                <div className={style["edit-btn"]}>
                  <MoreBtn text="手動調整" onClick={() => setEditCover(true)} />
                </div>
              </div>
            )}
            {editCover && (
              <ImgCutter
                title="調整預覽圖"
                archiveSize={{ width: 200, height: 200 }}
                editBoxSize={{ width: 400, height: 400 }}
                img={postData.imgs[0]}
                type="rect"
                aspect={1}
                setCuttingImg={(f?: File) => {
                  if (f) postDataDispatch({ type: "editCover", payload: f });
                  setEditCover(false);
                }}
                closeFnc={() => setEditCover(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ArtworkEditContainer;
