import HomeBeforeLogin from "./HomeBeforeLogin";
import HomeAfterLogin from "./HomeAfterLogin";
import { useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";
import changeWebTitle from "../../utils/changeWebTitle";

function Home() {
  const isLogin = useAppSelector((state) => state.login);
  useEffect(() => changeWebTitle(""), []);
  return isLogin ? <HomeAfterLogin /> : <HomeBeforeLogin />;
}

export default Home;
