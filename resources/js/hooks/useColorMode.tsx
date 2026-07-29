import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  // Dark is the site default; app.blade.php applies the same default
  // pre-paint so there is no light flash before React hydrates.
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "dark");
  useEffect(() => {
    if (colorMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorMode]);
  return [colorMode, setColorMode];
};

export default useColorMode;
