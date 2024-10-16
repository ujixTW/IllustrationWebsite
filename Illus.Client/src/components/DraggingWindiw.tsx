import { memo, useCallback, useEffect, useRef } from "react";

type Pos2D = {
  x: number;
  y: number;
};

function DraggingWindow(props: {
  startPos: Pos2D;
  offset: Pos2D;
  children: JSX.Element;
  onMouseMove: (...args: any[]) => any;
  onMouseUp: (...args: any[]) => any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleWindowPos = useCallback((pos: Pos2D) => {
    if (ref.current) {
      ref.current.style.left = pos.x + "px";
      ref.current.style.top = pos.y + "px";
    }
  }, []);

  useEffect(() => {
    const offset = props.offset;

    handleWindowPos(props.startPos);

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;

      handleWindowPos({ x, y });
      props.onMouseMove();
    };
    const handleUp = () => {
      props.onMouseUp();
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "fixed", zIndex: "999" }}>
      {props.children}
    </div>
  );
}

export default memo(DraggingWindow);
