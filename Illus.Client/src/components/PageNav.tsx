import style from "../assets/CSS/components/PageNav.module.css";
import { Link, useLocation } from "react-router-dom";
import { pageReg } from "../utils/artworkParmasRegHelper";
import Arrow from "../assets/arrow.svg?react";
import ThreeDot from "../assets/threeDot.svg?react";

function PageBtn(props: {
  isEnd: boolean;
  num: number;
  index?: boolean;
  img?: JSX.Element;
}) {
  const location = useLocation();
  const pageNo: number = props.num + 1;
  return (
    <div>
      <Link
        to={
          pageReg.test(location.search)
            ? location.pathname +
              location.search.replace(pageReg, `p=${pageNo}`)
            : location.pathname + location.search + `&p=${pageNo}`
        }
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
    : 1;

  const maxPage: number =
    max % pageCount > 0 ? Math.floor(max / pageCount) + 1 : max / pageCount;
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
