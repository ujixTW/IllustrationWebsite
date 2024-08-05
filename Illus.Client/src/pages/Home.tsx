import { useContext } from "react";
import { IsLoginContext } from "../context/LoginContext";
import BeforeLoginLayOut from "../layouts/BeforeLoginLayout";

function AfterLogin() {
  return (
    <>
      <hr />
      <h1>Home Page</h1>
      <hr />
    </>
  );
}
function BeforeLogin() {
  return <BeforeLoginLayOut context={<h1>123</h1>}></BeforeLoginLayOut>;
}

function Home() {
  const { isLogin } = useContext(IsLoginContext);

  return isLogin ? <AfterLogin /> : <BeforeLogin />;
}

export default Home;
