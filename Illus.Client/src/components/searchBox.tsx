import { memo, useEffect, useRef, useState } from "react";
import searchMark from "../assets/searchMark.svg";
import { ChangeEvent, FormEvent } from "../utils/tsTypesHelper";
import "../CSS/components/searchBox.css";
import AutoComplete from "./searchbox/autoComplete";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const search = (fd: FormEvent) => {
    fd.preventDefault();
    const inputStr: string = searchRef.current?.value as string;
    const qs = new URLSearchParams(location.search);

    if (qs.has("keywords")) {
      qs.set("keywords", inputStr);
    } else {
      qs.append("keywords", inputStr);
    }

    navigate(`/artworks?${qs}`);
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
    });
  }, []);
  useEffect(() => {
    if (searchRef.current != null) searchRef.current.value = searchText;
  }, [searchText]);

  return (
    <search className="search-box">
      <form className="search-box" onSubmit={search}>
        <input
          type="text"
          className="search"
          placeholder="搜尋作品"
          name="search"
          onChange={editSearchInput}
          ref={searchRef}
          onFocus={() => setIsFocus(true)}
          autoComplete="off"
        />
        <div className="search-box-end">
          {searchText.trim() !== "" && isFocus && (
            <button
              type="button"
              className="search-cancel"
              onClick={() => setSearchText("")}
            >
              x
            </button>
          )}
          <button className="search-submit" type="submit">
            <img src={searchMark} className="search-mark" alt="search" />
          </button>
        </div>
      </form>
      {searchText.trim() !== "" && isFocus && (
        <AutoComplete inputText={searchText} target={searchRef} />
      )}
    </search>
  );
}

export default memo(SearchBox);
