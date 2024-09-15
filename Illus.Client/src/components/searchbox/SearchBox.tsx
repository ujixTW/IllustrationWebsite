import style from "../../assets/CSS/components/SearchBox.module.css";
import path from "../../data/JSON/path.json";
import SearchMark from "../../assets/searchMark.svg?react";
import { ChangeEvent, FormEvent } from "../../utils/tsTypesHelper";
import AutoComplete from "./autoComplete";
import { useEffect, useRef, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { keywordParma } from "../../utils/parmasHelper";

function SearchBox() {
  const [searchText, setSearchText] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchParmas] = useSearchParams();
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
    if (searchParmas.has(keywordParma)) {
      const keyword = searchParmas.get(keywordParma);
      if (keyword != undefined && keyword != "") setSearchText(keyword);
    }
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
          autoComplete="off"
        />
        <div className={style["box-end"]}>
          {searchText.trim() !== "" && (
            <button
              type="button"
              className={style["cancel"]}
              onClick={() => setSearchText("")}
            >
              x
            </button>
          )}

          <button className={style["submit"]} type="submit">
            <SearchMark className={style["mark"]} />
          </button>
        </div>
        <AutoComplete inputText={searchText} target={searchRef} isLink />
      </form>
    </search>
  );
}

export default SearchBox;
