import { Link, Outlet } from "react-router-dom";
import SearchBox from "./components/searchBox";

function MainNav(props: { isLogin: boolean }) {
  return (
    <nav className="nav main-nav">
      <div className="nav-item nav-start">
        <Link to="/" className="nav nav-link-home">
          Home
        </Link>
      </div>
      <div className="nav-item nav-middle">
        <SearchBox />
      </div>

      {props.isLogin && <div className="nav-item nav-end"></div>}
    </nav>
  );
}
function RootLayout(props: { isLogin: boolean }) {
  return (
    <>
      <MainNav isLogin={props.isLogin} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
