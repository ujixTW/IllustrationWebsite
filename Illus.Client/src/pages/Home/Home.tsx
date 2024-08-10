import { useContext } from "react";
import { IsLoginContext } from "../../context/LoginContext";
import HomeBeforeLogin from "./HomeBeforeLogin";
import HomeAfterLogin from "./HomeAfterLogin";

function Home() {
  const { isLogin } = useContext(IsLoginContext);

  return isLogin ? <HomeAfterLogin /> : <HomeBeforeLogin />;
}

export default Home;
