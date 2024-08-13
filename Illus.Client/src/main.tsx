import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/CSS/index.css";
import { Provider } from "react-redux";
import { store } from "./data/reduxModels/reduxStore.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
