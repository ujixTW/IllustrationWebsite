import { useContext } from "react";
import HomeBeforeLogin from "./HomeBeforeLogin";
import HomeAfterLogin from "./HomeAfterLogin";
import { useAppSelector } from "../../hooks/redux";

function Home() {
  const isLogin = useAppSelector((state) => state.login);

  return isLogin ? <HomeAfterLogin /> : <HomeBeforeLogin />;
}

export default Home;
