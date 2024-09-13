import style from "../../assets/CSS/components/SearchBox.module.css";
import path from "../../data/JSON/path.json";
import axios from "axios";
import { RefObject, useEffect, useRef, useState } from "react";
import { Link, createSearchParams } from "react-router-dom";
import { asyncDebounce } from "../../utils/debounce";
import { TagType } from "../../data/typeModels/artwork";
import { ClickLinkEvent } from "../../utils/tsTypesHelper";

function RecommandLink(props: {
  recommand: string;
  textArr: string[];
  target: RefObject<HTMLInputElement>;
  isLink?: boolean;
}) {
  const tempArr = [...props.textArr];
  tempArr.push(props.recommand);
  const tempStr: string = tempArr.join(" ");
  return (
    <Link
      to={{
        pathname: `${path.artworks.list}`,
        search: `${createSearchParams({ keywords: tempStr })}`,
      }}
      className={style["recommand"]}
      onClick={(e: ClickLinkEvent) => {
        if (props.isLink != true) e.preventDefault();
        props.target.current != null
          ? (props.target.current.value = tempStr)
          : console.log("No target!");
      }}
    >
      {tempStr}
    </Link>
  );
}
function AutoComplete(props: {
  inputText: string;
  target: RefObject<HTMLInputElement>;
  changeAll?: boolean;
  isLink?: boolean;
}) {
  const textArr: string[] = props.changeAll
    ? [props.inputText.replace(" ", "")]
    : props.inputText.trim().split(" ");
  const searchText: string | undefined = textArr.pop();
  const [tagArr, setTagArr] = useState<TagType[]>([
    { id: 1, content: "sasas" },
    { id: 2, content: "eqwuih" },
  ]);
  const acRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if (e.key == "ArrowUp" && acRef.current != null) {
        e.preventDefault();
        const recommandArr = acRef.current.getElementsByTagName("a");
        if (
          document.activeElement == props.target.current ||
          document.activeElement == recommandArr[0]
        ) {
          props.target.current?.focus();
        } else {
          for (let i = 1; i < tagArr.length; i++) {
            if (document.activeElement == recommandArr[i]) {
              recommandArr[i - 1].focus();
              break;
            }
          }
        }
      } else if (e.key == "ArrowDown" && acRef.current != null) {
        e.preventDefault();
        const recommandArr = acRef.current.getElementsByTagName("a");
        if (
          document.activeElement == props.target.current ||
          document.activeElement == recommandArr[tagArr.length - 1]
        ) {
          recommandArr[0].focus();
        } else {
          for (let i = 0; i < tagArr.length - 1; i++) {
            if (document.activeElement == recommandArr[i]) {
              recommandArr[i + 1].focus();
              break;
            }
          }
        }
      }
    };

    window.addEventListener("keydown", keyboard);
    return () => {
      window.removeEventListener("keydown", keyboard);
    };
  }, []);

  useEffect(
    asyncDebounce(async () => {
      if (searchText) {
        await axios
          .get("/api/Work/GetSearchRecommand", {
            params: { st: encodeURI(searchText) },
          })
          .then((res) => setTagArr(res.data as TagType[]))
          .catch((err) => console.log("Get Recommand Fail." + err));
      }
    }),
    [props.inputText]
  );

  const list = tagArr.map((val: TagType) => (
    <RecommandLink
      key={val.id}
      recommand={val.content}
      textArr={textArr}
      target={props.target}
      isLink={props.isLink}
    />
  ));

  return tagArr.length > 0 ? (
    <div className={style["auto-complete"]} ref={acRef}>
      {list}
    </div>
  ) : (
    <></>
  );
}

export default AutoComplete;
