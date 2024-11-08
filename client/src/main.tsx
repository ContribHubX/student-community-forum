// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./sass/main.scss";
import App from "./app";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
);
