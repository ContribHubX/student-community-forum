import { ThemeContextProvider } from "../providers/theme";
import { AppRouter } from "./router";
import AuthContextComponent from "@/providers/auth/component";

const AppProvider = () => {
  return (
    <>
      <AuthContextComponent>
        <ThemeContextProvider>
          <AppRouter />
        </ThemeContextProvider>
      </AuthContextComponent>
    </>
  );
};

export default AppProvider;
