import style from "../assets/CSS/components/PageNav.module.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { pageParma, pageReg } from "../utils/parmasHelper";
import Arrow from "../assets/SVG/arrow.svg?react";
import ThreeDot from "../assets/SVG/threeDot.svg?react";
import { useCallback } from "react";

function PageBtn(props: {
  isEnd: boolean;
  num: number;
  index?: boolean;
  img?: JSX.Element;
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pageNo: number = props.num + 1;

  const parmas = useCallback(() => {
    const copyParmas = new URLSearchParams(searchParams);
    if (copyParmas.has(pageParma)) copyParmas.set(pageParma, pageNo.toString());
    else copyParmas.append(pageParma, pageNo.toString());
    return copyParmas.toString();
  }, [searchParams]);

  return (
    <div>
      <Link
        to={location.pathname + "?" + parmas()}
        className={
          style["link"] +
          (props.isEnd == true ? " " + style["end-link"] : "") +
          (props.index == true ? " " + style["index"] : "")
        }
      >
        {props.isEnd == true && props.img != undefined ? (
          props.img
        ) : (
          <span> {pageNo}</span>
        )}
      </Link>
    </div>
  );
}

export default function PageNav(props: { max: number; pageCount: number }) {
  const location = useLocation();
  const { max, pageCount } = props;
  const linkArr: JSX.Element[] = [];

  const index = pageReg.test(location.search)
    ? parseInt(location.search.match(pageReg)![0].split("=")[1]) - 1
    : 0;

  const maxPage: number = Math.ceil(max / pageCount);
  const baseForNum: number =
    index > maxPage - 2 && maxPage >= 5
      ? maxPage - 5
      : index > 2
      ? index - 2
      : 0;
  const maxForNum: number = baseForNum + 5 > maxPage ? maxPage : baseForNum + 5;

  for (let i = baseForNum; i < maxForNum; i++) {
    linkArr.push(
      <PageBtn key={`pageBtn${i}`} isEnd={false} num={i} index={index == i} />
    );
  }

  return (
    <div className={style["nav"]}>
      {baseForNum > 0 && (
        <PageBtn
          isEnd={true}
          num={index - 1}
          img={<Arrow className={style["back"]} />}
        />
      )}
      {baseForNum > 1 && (
        <>
          <PageBtn isEnd={false} num={0} />
          <div className={style["omit"]}>
            <ThreeDot className={style["three-dot"]} />
          </div>
        </>
      )}
      {linkArr}
      {maxForNum < maxPage && (
        <PageBtn
          isEnd={true}
          num={index + 1}
          img={<Arrow className={style["next"]} />}
        />
      )}
    </div>
  );
}
