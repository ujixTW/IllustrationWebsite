import { RefObject, useEffect, useState } from "react";

export const useScroll = (
  parent: Window | RefObject<HTMLElement | undefined>,
  addEventListener = true
) => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollUp, setScrollUp] = useState(false);
  const scrollDown = !scrollUp;
  const [scrollLeft, setScrollLeft] = useState(false);
  const scrollRight = !scrollLeft;

  useEffect(() => {
    const target =
      parent == window
        ? parent
        : (parent as RefObject<HTMLElement | undefined>).current;

    const handleScroll = () => {
      if (target == window) {
        setScrollUp(scrollY > target.scrollY);

        setScrollLeft(scrollX > target.scrollX);
        setScrollX(target.scrollX);
        setScrollY(target.scrollY);
      } else {
        const parentHtml = target as HTMLElement | undefined;
        if (parentHtml) {
          setScrollUp(scrollY > parentHtml.scrollTop);

          setScrollLeft(scrollX > parentHtml.scrollLeft);

          setScrollX(parentHtml.scrollLeft);
          setScrollY(parentHtml.scrollTop);
        }
      }
    };
    if (addEventListener && target) {
      target.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (target) target.removeEventListener("scroll", handleScroll);
    };
  });

  return { scrollX, scrollY, scrollUp, scrollDown, scrollLeft, scrollRight };
};
