import { ThemeContext } from "@/providers/theme";
import { useContext } from "react";

export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("Theme context not wrapped.");
  }

  return theme;
};
