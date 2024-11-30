import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AppRouter } from "./router";

import { ThemeContextProvider } from "@/providers/theme";
import AuthContextComponent from "@/providers/auth/component";
import SocketContextComponent from "@/providers/socket/component";
import { BoardContextProvider } from "@/features/workspace/provider/board";

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
