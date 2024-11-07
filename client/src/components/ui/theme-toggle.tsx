import { useState } from "react";
import { setDarkMode } from "../../utils/theme";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const mode = localStorage.getItem("dark") === "1";
    setDarkMode(mode);
    return mode;
  });

  const toggleMode = () => {
    const mode = !isDark;
    setIsDark(mode);
    setDarkMode(mode);
  };

  return (
    <button
      onClick={toggleMode}
      className="border px-2 cursor-pointer  rounded-full bg-secondary flex items-center"
    >
      Click
    </button>
  );
};
