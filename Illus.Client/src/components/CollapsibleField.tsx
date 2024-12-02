import { memo, useEffect, useReducer, useRef, useState } from "react";

type reducerAct =
  | {
      type: "setLength";
      payload: { width: number; height: number; opcity: number };
    }
  | { type: "setOverflow"; payload: "hidden" | "visible" }
  | { type: "setStyle"; payload: React.CSSProperties };

const styleReducer = function (state: React.CSSProperties, action: reducerAct) {
  const copyState = Object.assign({}, state);
  const { type, payload } = action;

  switch (type) {
    case "setStyle":
      return payload;
    case "setLength":
      const lenHeight = copyState.height?.toString();
      const lenWidth = copyState.width?.toString();
      copyState.width = lenWidth ? payload.width : undefined;
      copyState.height = lenHeight ? payload.height : undefined;
      copyState.opacity = payload.opcity;
      return copyState;
    case "setOverflow":
      if (payload === "hidden" || payload === "visible")
        copyState.overflow = payload;
      return copyState;
    default:
      return copyState;
  }
};

function CollapsibleField(props: {
  children: JSX.Element;
  baseWidth?: number;
  baseHeight?: number;
  isShow: boolean;
  time?: number;
}) {
  const [show, setShow] = useState(false);
  const [style, styleDispath] = useReducer(styleReducer, {});
  const divRef = useRef<HTMLDivElement>(null);
  const displayDef = useRef(false);
  const transitionTime = useRef(0);
  const timeConter = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    const { baseHeight, baseWidth } = props;
    let isDis =
      (baseHeight !== undefined && baseHeight > 0) ||
      (baseWidth !== undefined && baseWidth > 0);

    displayDef.current = isDis;
    styleDispath({
      type: "setStyle",
      payload: {
        height: baseHeight,
        width: baseWidth,
        opacity: isDis ? 1 : 0,
        overflow: "hidden",
      },
    });
    setShow(isDis);
  }, []);

  useEffect(() => {
    if (props.time) {
      transitionTime.current = props.time;
    } else {
      transitionTime.current = 200;
    }
  }, [props.time]);

  useEffect(() => {
    if (mounted.current === false) {
      if (props.isShow) mounted.current = true;
      else return;
    }
    const gap = 10;

    const handleTransition = (
      intervalID: number,
      isOpen: boolean,
      gap: number
    ) => {
      const _div = divRef.current;
      const tick = isOpen
        ? timeConter.current / transitionTime.current
        : 1 - timeConter.current / transitionTime.current;

      if (_div === null) return clearInterval(intervalID);

      const _width = _div.scrollWidth * tick;
      const _height = _div.scrollHeight * tick;
      const { baseWidth, baseHeight } = props;
      styleDispath({
        type: "setLength",
        payload: {
          width: baseWidth && baseWidth > _width ? baseWidth : _width,
          height: baseHeight && baseHeight > _height ? baseHeight : _height,
          opcity: displayDef.current ? 1 : tick,
        },
      });
      styleDispath({
        type: "setOverflow",
        payload: tick < 1 || !isOpen ? "hidden" : "visible",
      });

      if (timeConter.current >= transitionTime.current) {
        if (!isOpen && !displayDef.current) setShow(false);
        timeConter.current = 0;
        clearInterval(intervalID);
        return;
      }
      timeConter.current += gap;
    };

    setShow(true);
    const interval = setInterval(
      () => handleTransition(interval, props.isShow, gap),
      gap
    );
  }, [props.isShow]);

  return show ? (
    <div style={style} ref={divRef}>
      {props.children}
    </div>
  ) : (
    <></>
  );
}

export default memo(CollapsibleField);
