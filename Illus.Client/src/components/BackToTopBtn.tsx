import { RefObject, useEffect, useState } from "react";
import style from "../assets/CSS/BackToTopBtn.module.css";

function BackToTopBtn(props: { scope?: RefObject<HTMLDivElement> }) {
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    const onTop = () => {
      const scope = props.scope?.current;
      if ((scope != null && scope.scrollTop > 100) || window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", onTop, true);
    return () => window.removeEventListener("scroll", onTop);
  }, []);

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      {show && (
        <div>
          <button type="button" className={style["btn"]} onClick={handleClick}>
            &#8682;
          </button>
        </div>
      )}
    </>
  );
}

export default BackToTopBtn;
