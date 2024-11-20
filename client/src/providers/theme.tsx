import { createContext, PropsWithChildren, useState } from "react";
import { setDarkMode } from "../utils/theme";

type ThemeContextType = {
  isDark: boolean;
  toggleMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleMode: () => {},
});

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
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
    <ThemeContext.Provider value={{ isDark, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
