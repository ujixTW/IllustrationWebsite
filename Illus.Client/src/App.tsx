import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './CSS/App.css';
import NoMatch from './NoMatch';
import RootLayout from './RootLayout';
import Home from './Home';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
