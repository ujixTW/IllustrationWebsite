import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./assets/CSS/App.css";
import NoMatch from "./pages/NoMatch";
import RootLayout from "./RootLayout";
import Home from "./pages/Home/Home";
import ArtworkList from "./pages/artwork/ArtworkList";
import Login from "./pages/Login/Login";
import AccountsLayout from "./layouts/AccountsLayout";
import SignUp from "./pages/SignUp/SignUp";
import Confirm from "./pages/SignUp/Confirm";
import ConfirmAgain from "./pages/SignUp/ConfirmAgain";
import Forget from "./pages/Login/Forget";
import ResetPwd from "./pages/Login/ResetPwd";
import Artwork from "./pages/artwork/Artwork";
import ArtworkEdit from "./pages/artwork/Edit/ArtworkEdit";
import ArtworlEditSuccess from "./pages/artwork/Edit/ArtworkEditSuccess";
import User from "./pages/User/User";
import Settings from "./pages/User/Settings";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/artworks">
            <Route index element={<ArtworkList />} />
            <Route path="following" element={<ArtworkList isFollowing />} />
            <Route path="create" element={<ArtworkEdit isCreate />} />
            <Route path=":artworkId" element={<Artwork />} />
            <Route path=":artworkId/edit" element={<ArtworkEdit />} />
            <Route path="edit/success" element={<ArtworlEditSuccess />} />
          </Route>
          <Route path="/user/:id">
            <Route index element={<User />} />
            <Route path="settings" element={<Settings />} />
            <Route path="artworks" element={<Home />} />
            <Route path="following" element={<Home />} />
            <Route path="follower" element={<Home />} />
            <Route path="likes" element={<Home />} />
            <Route path="histories" element={<Home />} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route element={<AccountsLayout />}>
          <Route path="login">
            <Route index element={<Login />} />
            <Route path="forget" element={<Forget />} />
            <Route path="reset-password/:email" element={<ResetPwd />} />
          </Route>
          <Route path="signUp">
            <Route index element={<SignUp />} />
            <Route path="confirm/:captcha" element={<Confirm />} />
            <Route path="confirm-again/:captcha" element={<ConfirmAgain />} />
          </Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
