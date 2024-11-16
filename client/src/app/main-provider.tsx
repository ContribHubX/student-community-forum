import { ThemeContextProvider } from "../providers/theme";
import { AppRouter } from "./router";
import AuthContextComponent from "@/providers/auth/component";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import SocketContextComponent from "@/providers/socket/component";

const AppProvider = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextComponent>
          <SocketContextComponent>
            <ThemeContextProvider>
              <AppRouter />
            </ThemeContextProvider>
          </SocketContextComponent>
        </AuthContextComponent>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
