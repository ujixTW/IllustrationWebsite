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
  closeFnc?: (...args: any[]) => any;
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
}) {
  const [translate, setTranslate] = useState("");
  const [dirClass, setDirClass] = useState("");
  const [opacity, setOpacity] = useState<number | undefined>(0);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const direction = props.up
    ? dirEnum.up
    : props.left
    ? dirEnum.left
    : props.right
    ? dirEnum.right
    : dirEnum.down;
  if (props.closeFnc) useClickOutside(dropDownRef, props.closeFnc);

  const handleOutSideOffset = (dir: dirEnum): string => {
    let offset = "";
    const dropDown = dropDownRef.current;

    if (dropDown) {
      const rect = dropDown.getBoundingClientRect();

      switch (dir) {
        case dirEnum.left:
        case dirEnum.right:
          if (rect.top < 0) {
            offset = ` translateY(calc(-50% + ${rect.top - 10}px))`;
          } else if (rect.bottom < 0) {
            offset = ` translateY(calc(-50% + ${-rect.bottom + 10}px))`;
          }
          break;
        case dirEnum.up:
        case dirEnum.down:
        default:
          if (rect.left < 0) {
            offset = ` translateX(calc(-50% + ${-rect.left + 10}px))`;
          } else if (rect.right < 0) {
            offset = ` translateX(calc(-50% + ${rect.right - 10}px))`;
          }
          break;
      }
    }
    return offset;
  };
  useEffect(() => {
    switch (direction) {
      case dirEnum.left:
        setDirClass("left");
        break;
      case dirEnum.right:
        setDirClass("right");
        break;
      case dirEnum.up:
        setDirClass("up");
        break;
      case dirEnum.down:
      default:
        setDirClass("down");
        break;
    }
  }, []);

  useEffect(() => {
    if (dirClass != "") {
      const offset = handleOutSideOffset(direction);

      setTranslate(offset);
      setOpacity(undefined);
    }
  }, [dirClass]);

  return (
    <div
      className={style["drop-down"] + " " + style[dirClass]}
      style={{ transform: translate, opacity: opacity }}
      ref={dropDownRef}
    >
      {props.children}
    </div>
  );
}

export default memo(DropDown);
