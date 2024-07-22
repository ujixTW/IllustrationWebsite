import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import searchMark from "./assets/searchMark.svg";
import { FormEvent } from "./utils/tsTypesHelper";

function RootLayout() {
  const [isLogin, setIsLogin] = useState(false);

  const search = (fd: FormEvent) => {
    fd.preventDefault();
    const data = new FormData(fd.currentTarget);
    const inputStr = data.get("search") as string;
    alert(inputStr);
  };

  return (
    <>
      <nav className="nav main-nav">
        <div className="nav-item">
          {isLogin && <button></button>}
          <NavLink to="/" className="nav nav-link-home">
            Home
          </NavLink>
        </div>
        <form className="nav-item search-box" onSubmit={search}>
          <input className="search" placeholder="搜尋作品" name="search" />
          <button className="submit" type="submit">
            <img src={searchMark} className="search-mark" alt="search" />
          </button>
        </form>
        <div></div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
