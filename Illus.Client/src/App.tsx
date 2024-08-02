import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./assets/CSS/App.css";
import NoMatch from "./pages/NoMatch";
import RootLayout from "./RootLayout";
import Home from "./pages/Home";
import ArtworkList from "./pages/artwork/ArtworkList";
import CreateArtwork from "./pages/artwork/Create";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/artworks" element={<ArtworkList />} />
        <Route path="/artworks/create" element={<CreateArtwork />} />
        <Route path="/artworks/:artworkId" element={<Home />} />
        <Route path="/user/:id" element={<Home />} />
        <Route path="/user/:id/following" element={<Home />} />
        <Route path="/user/:id/follower" element={<Home />} />
        <Route path="/user/:id/likes" element={<Home />} />
        <Route path="/user/:id/histories" element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
