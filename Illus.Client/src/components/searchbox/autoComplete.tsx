import style from "../../assets/CSS/components/AutoComplete.module.css";
import path from "../../data/JSON/path.json";
import axios from "axios";
import {
  FocusEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, createSearchParams } from "react-router-dom";
import { asyncDebounce } from "../../utils/debounce";
import { TagType } from "../../data/typeModels/artwork";
import { ClickLinkEvent } from "../../utils/tsTypesHelper";

function RecommandLink(props: {
  recommand: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  textArr: string[];
  target: RefObject<HTMLInputElement>;
  changeAll?: boolean;
  isLink?: boolean;
  autoBlur?: boolean;
  onBlur: FocusEventHandler;
}) {
  const tempArr = [...props.textArr];
  tempArr.push(props.recommand);
  const tempStr = tempArr.join(" ");
  return (
    <Link
      to={{
        pathname: `${path.artworks.list}`,
        search: `${createSearchParams({ keywords: tempStr })}`,
      }}
      className={style["recommand"]}
      onClick={(e: ClickLinkEvent) => {
        if (props.isLink != true) e.preventDefault();
        props.setInputText(tempStr);

        const _target = props.target.current;
        if (_target != null) _target.focus();
        if (props.autoBlur) {
          setTimeout(() => {
            if (_target != null) _target.blur();
          }, 0);
        }
      }}
      onBlur={props.onBlur}
    >
      {tempStr}
    </Link>
  );
}

function Content(props: {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  target: RefObject<HTMLInputElement>;
  changeAll?: boolean;
  tagArr: TagType[];
  isLink?: boolean;
  autoBlur?: boolean;
  setIsFocus: (...args: any[]) => any;
}) {
  const textArr: string[] = props.changeAll
    ? [props.inputText.replace(" ", "")]
    : props.inputText.trim().split(" ");
  textArr.pop();
  const { tagArr } = props;
  const acRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if (e.key == "ArrowUp" && acRef.current != null) {
        e.preventDefault();
        const recommandArr = acRef.current.getElementsByTagName("a");
        if (document.activeElement == props.target.current) {
          recommandArr[recommandArr.length - 1].focus();
        } else if (document.activeElement == recommandArr[0]) {
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
        if (document.activeElement == props.target.current) {
          recommandArr[0].focus();
        } else if (document.activeElement == recommandArr[tagArr.length - 1]) {
          props.target.current?.focus();
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

  const handleBlur = async () => {
    await setTimeout(() => {
      if (acRef.current) {
        let isFocus = false;
        const recommandArr = acRef.current.getElementsByTagName("a");
        if (
          props.target.current &&
          props.target.current.contains(document.activeElement)
        ) {
          isFocus = true;
        } else {
          for (let i = 0; i < recommandArr.length; i++) {
            if (recommandArr[i].contains(document.activeElement)) {
              isFocus = true;
              break;
            }
          }
        }
        props.setIsFocus(isFocus);
      }
    }, 0);
  };

  const list = tagArr.map((val: TagType) => (
    <RecommandLink
      key={val.id}
      setInputText={props.setInputText}
      recommand={val.content}
      textArr={textArr}
      target={props.target}
      changeAll={props.changeAll}
      isLink={props.isLink}
      autoBlur={props.autoBlur}
      onBlur={handleBlur}
    />
  ));

  return <div ref={acRef}>{list}</div>;
}

function AutoComplete(props: {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  target: RefObject<HTMLInputElement>;
  changeAll?: boolean;
  isLink?: boolean;
  onTargetTop?: boolean;
  autoBlur?: boolean;
}) {
  const [isFocus, setIsFocus] = useState(false);
  const acRef = useRef<HTMLDivElement>(null);
  const [tagArr, setTagArr] = useState<TagType[]>([]);
  const textArr: string[] = props.changeAll
    ? [props.inputText.replace(" ", "")]
    : props.inputText.trim().split(" ");

  useEffect(() => {
    const handleTargetFocus = () => setIsFocus(true);
    const handleTargetBlur = async () => {
      await setTimeout(() => {
        if (acRef.current) {
          const childArr = acRef.current.querySelectorAll("a");
          let isChild = false;
          childArr.forEach((child) => {
            if (child.contains(document.activeElement as HTMLElement)) {
              isChild = true;
              return;
            }
          });
          setIsFocus(isChild);
        }
      }, 0);
    };
    if (props.target.current) {
      const target = props.target.current;
      target.addEventListener("focus", handleTargetFocus);
      target.addEventListener("blur", handleTargetBlur);
    }
    return () => {
      if (props.target.current) {
        const target = props.target.current;
        target.removeEventListener("focus", handleTargetFocus);
        target.removeEventListener("blur", handleTargetBlur);
      }
    };
  }, []);

  useEffect(
    asyncDebounce(() => {
      if (props.inputText.trim().length < 0) return setTagArr([]);
      const searchText: string | undefined = textArr.pop();

      if (searchText) {
        axios
          .get("/api/Work/GetSearchRecommand", {
            params: { st: encodeURI(searchText) },
          })
          .then((res) => {
            setTagArr(res.data as TagType[]);
          })
          .catch((err) => console.log("Get Recommand Fail." + err));
      }
    }),
    [props.inputText]
  );

  return isFocus && props.inputText.trim() != "" && tagArr.length > 0 ? (
    <div
      className={
        style["auto-complete"] +
        " " +
        (props.onTargetTop ? style["top"] : style["bottom"])
      }
      ref={acRef}
    >
      <Content
        inputText={props.inputText}
        setInputText={props.setInputText}
        target={props.target}
        changeAll={props.changeAll}
        tagArr={tagArr}
        isLink={props.isLink}
        setIsFocus={setIsFocus}
        autoBlur={props.autoBlur}
      />
    </div>
  ) : (
    <></>
  );
}

export default AutoComplete;
