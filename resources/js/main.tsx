import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { HelmetProvider } from "react-helmet-async";

// Material Tailwind's ThemeProvider was removed: no component consumed its
// theme context, and importing it pulled the whole library into the bundle.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);
