import style from "../../assets/CSS/components/SearchBox.module.css";
import path from "../../data/JSON/path.json";
import SearchMark from "../../assets/searchMark.svg?react";
import { ChangeEvent, FormEvent } from "../../utils/tsTypesHelper";
import AutoComplete from "./AutoComplete";
import { useEffect, useRef, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

function SearchBox() {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const search = (fd: FormEvent) => {
    fd.preventDefault();
    const inputStr: string = searchRef.current?.value as string;

    if (inputStr.trim() != "") {
      navigate({
        pathname: `${path.artworks.list}`,
        search: `${createSearchParams({ keywords: inputStr })}`,
      });
    }
  };

  const editSearchInput = (id: ChangeEvent) => {
    setSearchText(id.currentTarget.value as string);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (
        e.target != document.querySelector(".auto-complete") &&
        e.target != searchRef.current
      )
        setIsFocus(false);
      else setIsFocus(true);
    });
  }, []);

  useEffect(() => {
    if (searchRef.current != null) searchRef.current.value = searchText;
  }, [searchText]);

  return (
    <search className={style["search-box"]}>
      <form className={style["search-box"]} onSubmit={search}>
        <input
          type="text"
          className={style["search"]}
          placeholder="搜尋作品"
          name="search"
          onChange={editSearchInput}
          ref={searchRef}
          onFocus={() => setIsFocus(true)}
          autoComplete="off"
        />
        <div className={style['box-end']}>
          {searchText.trim() !== "" && isFocus && (
            <button
              type="button"
              className={style['cancel']}
              onClick={() => setSearchText("")}
            >
              x
            </button>
          )}
          <button className={style['submit']} type="submit">
            <SearchMark className={style['mark']} />
          </button>
        </div>
      </form>
      {searchText.trim() !== "" && isFocus && (
        <AutoComplete inputText={searchText} target={searchRef} />
      )}
    </search>
  );
}

export default SearchBox;
