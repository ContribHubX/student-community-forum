import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import {
  authReducer,
  defaultAuthContextState,
  AuthContextProvider,
  OPERATION,
} from "./context";
import { api } from "@/lib/axios";
import { MyLoader } from "@/components/shared/loader";

const AuthContextComponent = ({ children }: PropsWithChildren) => {
  const [authState, authDispatch] = useReducer(
    authReducer,
    defaultAuthContextState,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const response = await api.get("/api/auth/me");
        authDispatch({
          type: OPERATION.LOGIN_USER,
          payload: { ...response.data },
        });
        setLoading(false);
      } catch (error: any) {
        if (error.status === 401) {
          console.log(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoginState();
  }, []);

  if (loading) {
    return <MyLoader />;
  }

  return (
    <AuthContextProvider value={{ authState, authDispatch }}>
      {children}
    </AuthContextProvider>
  );
};

export default AuthContextComponent;
