import { useEffect, useState } from "react";

export function useScroll(
  parent: Window | HTMLElement,
  addEventListener = true
) {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollUp, setScrollUp] = useState(false);
  const scrollDown = !scrollUp;
  const [scrollLeft, setScrollLeft] = useState(false);
  const scrollRight = !scrollLeft;
  useEffect(() => {
    const handleScroll = () => {
      if (parent == window) {
        setScrollUp(scrollY - parent.scrollY > 0);

        setScrollLeft(scrollX - parent.scrollX > 0);

        setScrollX(parent.scrollX);
        setScrollY(parent.scrollY);
      } else {
        const parentHtml = parent as HTMLElement;

        setScrollUp(scrollY - parentHtml.scrollTop > 0);

        setScrollLeft(scrollX - parentHtml.scrollLeft > 0);

        setScrollX(parentHtml.scrollLeft);
        setScrollY(parentHtml.scrollTop);
      }
    };

    if (addEventListener) {
      parent.addEventListener("scroll", handleScroll);
    }
    return () => {
      parent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollX, scrollY, scrollUp, scrollDown, scrollLeft, scrollRight };
}
