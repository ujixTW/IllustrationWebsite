import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./CSS/App.css";
import NoMatch from "./pages/NoMatch";
import RootLayout from "./RootLayout";
import Home from "./pages/Home";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout isLogin={true} />}>
        <Route path="*" element={<NoMatch />} />
        <Route index element={<Home />} />
        <Route path="/artworks" element={<Home />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
