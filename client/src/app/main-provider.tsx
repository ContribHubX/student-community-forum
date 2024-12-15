import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./router";

import { BoardContextProvider } from "@/features/workspace/provider/board";
import AuthContextComponent from "@/providers/auth/component";
import SocketContextComponent from "@/providers/socket/component";
import { ThemeContextProvider } from "@/providers/theme";

const AppProvider = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextComponent>
          <SocketContextComponent>
            <ThemeContextProvider>
              <BoardContextProvider>
                <AppRouter />
              </BoardContextProvider>
            </ThemeContextProvider>
          </SocketContextComponent>
        </AuthContextComponent>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
