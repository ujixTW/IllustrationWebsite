import axios from "axios";
import { RefObject, useEffect, useRef, useState } from "react";
import { Link, createSearchParams } from "react-router-dom";
import { asyncDebounce } from "../../utils/debounce";
import { TagType } from "../../data/typeModels/artwork";

function RecommandLink(props: {
  recommand: string;
  textArr: string[];
  target: RefObject<HTMLInputElement>;
}) {
  const tempArr = [...props.textArr];
  tempArr.push(props.recommand);
  const tempStr: string = tempArr.join(" ");
  return (
    <Link
      to={{
        pathname: "/artworks",
        search: `${createSearchParams({ keywords: tempStr })}`,
      }}
      className="auto-complete-recommand"
      onClick={() =>
        props.target.current != null
          ? (props.target.current.value = tempStr)
          : console.log("No target!")
      }
    >
      {tempStr}
    </Link>
  );
}

function AutoComplete(props: {
  inputText: string;
  target: RefObject<HTMLInputElement>;
}) {
  const textArr: string[] = props.inputText.split(" ");
  const lastInputText: string = textArr[textArr.length - 1];
  const [tagArr, setTagArr] = useState<TagType[]>([
    { id: 0, content: "aa" },
    { id: 2, content: "測試2" },
  ]);
  const acRef = useRef<HTMLDivElement>(null);
  textArr.pop();

  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if (e.key == "ArrowUp" && acRef.current != null) {
        if (
          document.activeElement == props.target.current ||
          document.activeElement == acRef.current.getElementsByTagName("a")[0]
        ) {
          props.target.current?.focus();
        } else {
          for (let i = 1; i < tagArr.length; i++) {
            if (
              document.activeElement ==
              acRef.current.getElementsByTagName("a")[i]
            ) {
              acRef.current.getElementsByTagName("a")[i - 1].focus();
              break;
            }
          }
        }
      } else if (e.key == "ArrowDown" && acRef.current != null) {
        if (
          document.activeElement == props.target.current ||
          document.activeElement ==
            acRef.current.getElementsByTagName("a")[tagArr.length - 1]
        ) {
          acRef.current.getElementsByTagName("a")[0].focus();
        } else {
          for (let i = 0; i < tagArr.length - 1; i++) {
            if (
              document.activeElement ==
              acRef.current.getElementsByTagName("a")[i]
            ) {
              acRef.current.getElementsByTagName("a")[i + 1].focus();
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
      await axios
        .get("/api/Work/GetSearchRecommand", {
          params: { st: encodeURI(lastInputText) },
        })
        .then((res) => setTagArr(res.data as TagType[]))
        .catch((err) => console.log("Get Recommand Fail." + err));
    }),
    [props.inputText]
  );

  const list = tagArr.map((val: TagType) => (
    <RecommandLink
      key={val.id}
      recommand={val.content}
      textArr={textArr}
      target={props.target}
    />
  ));

  return (
    <div className="auto-complete" ref={acRef}>
      {list}
    </div>
  );
}

export default AutoComplete;
