import { ThemeContextProvider } from "../providers/theme";
import { AppRouter } from "./router";

const AppProvider = () => {
  return (
    <>
      <ThemeContextProvider>
        <AppRouter />
      </ThemeContextProvider>
    </>
  );
};

export default AppProvider;
