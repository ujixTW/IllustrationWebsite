import { Link, Outlet } from "react-router-dom";
import SearchBox from "./components/searchbox/SearchBox";
import { useContext, useEffect, useState } from "react";
import { userDataType } from "./data/typeModels/user";
import axios from "axios";
import {
  IsLoginContext,
  UserDataContext,
  defaultUserDataContextValue,
} from "./context/LoginContext";
import UserMenu from "./components/UserMenu";
import { ImagePathHelper } from "./utils/ImagePathHelper";

function MainNav() {
  const {isLogin} = useContext(IsLoginContext);
  return (
    <nav className="nav main-nav">
      <div className="nav-item nav-start">
        <Link to="/" className="nav nav-link-home">
          IllusWeb
        </Link>
      </div>
      <div className="nav-item nav-middle">
        <SearchBox />
      </div>

      {isLogin ? (
        <div className="nav-item nav-end">
          <Link to="/artworks/create" className="btn main-nav">
            上傳作品
          </Link>
          <UserMenu />
        </div>
      ) : (
        <div className="nav-item nav-end">
          <Link to="/login" className="btn main-nav">
            登入
          </Link>
          <Link to="/signUp" className="btn main-nav">
            註冊
          </Link>
        </div>
      )}
    </nav>
  );
}
function RootLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<userDataType>(
    defaultUserDataContextValue
  );
  // useEffect(() => {
  //   axios
  //     .get("/api/LoginCheck")
  //     .then((res) => {
  //       let tempData = res.data as userDataType;
  //       tempData.cover = ImagePathHelper(tempData.cover);
  //       tempData.headshot = (tempData.headshot!="")?ImagePathHelper(tempData.headshot):"defaultImg/defaultHeadshot.svg";
  //       setUserData(tempData);
  //       setIsLogin(true);
  //     })
  //     .catch(() => setIsLogin(false));
  // }, []);
  return (
    <UserDataContext.Provider
      value={{ userData: userData, setUserData: setUserData }}
    >
      <IsLoginContext.Provider
        value={{ isLogin: isLogin, setIsLogin: setIsLogin }}
      >
        <MainNav />
        <main>
          <Outlet />
        </main>
      </IsLoginContext.Provider>
    </UserDataContext.Provider>
  );
}

export default RootLayout;
