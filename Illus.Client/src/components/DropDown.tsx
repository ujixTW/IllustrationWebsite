import { memo, useEffect, useRef, useState } from "react";
import style from "../assets/CSS/components/DropDown.module.css";
import { useClickOutside } from "../hooks/useClickOutside";

enum dirEnum {
  down,
  up,
  left,
  right,
}

function DropDown(props: {
  children: JSX.Element;
  closeFnc: (...args: any[]) => any;
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
}) {
  const [translate, setTranslate] = useState("");
  const [dirClass, setDirClass] = useState("");
  const dropDownRef = useRef<HTMLDivElement>(null);
  const direction = props.up
    ? dirEnum.up
    : props.left
    ? dirEnum.left
    : props.right
    ? dirEnum.right
    : dirEnum.down;
  useClickOutside(dropDownRef, props.closeFnc);

  const handleOutSideOffset = (dir: dirEnum): string => {
    let offset = "";
    const dropDown = dropDownRef.current;

    if (dropDown) {
      const rect = dropDown.getBoundingClientRect();
      if (dir == dirEnum.down || dir == dirEnum.up) {
        if (rect.left < 0) {
          offset = ` translateX(${-rect.left}px)`;
        } else if (rect.right < 0) {
          offset = ` translateX(${rect.right}px)`;
        }
      } else if (dir == dirEnum.left || dir == dirEnum.right) {
        if (rect.top < 0) {
          offset = ` translateY(${rect.top}px)`;
        } else if (rect.bottom < 0) {
          offset = ` translateY(${-rect.bottom}px)`;
        }
      }
    }
    return offset;
  };
  useEffect(() => {
    switch (direction) {
      case dirEnum.left:
        setTranslate("translateY(-50%)");
        setDirClass("left");

        break;
      case dirEnum.right:
        setTranslate("translateY(-50%)");
        setDirClass("right");

        break;
      case dirEnum.up:
        setTranslate("translateX(-50%)");
        setDirClass("up");

        break;
      default:
        setTranslate("translateX(-50%)");
        setDirClass("down");
        break;
    }
  }, []);
  useEffect(() => {
    if (dirClass != "") {
      const offset = handleOutSideOffset(direction);

      setTranslate(translate + offset);
    }
  }, [dirClass]);

  return (
    <div
      className={style["drop-down"] + " " + style[dirClass]}
      style={{ transform: translate }}
      ref={dropDownRef}
    >
      {props.children}
    </div>
  );
}

export default memo(DropDown);
