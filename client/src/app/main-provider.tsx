import { ThemeContextProvider } from "../providers/theme";
import { AppRouter } from "./router";
import AuthContextComponent from "@/providers/auth/component";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

const AppProvider = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextComponent>
          <ThemeContextProvider>
            <AppRouter />
          </ThemeContextProvider>
        </AuthContextComponent>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
