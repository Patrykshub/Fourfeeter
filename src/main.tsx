import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { app } from "./model/Application";
import App from "./App";
import "./index.css";

const bootstrap = async (): Promise<void> => {
  await app().init();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
