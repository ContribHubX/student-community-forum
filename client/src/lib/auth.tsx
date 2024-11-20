/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.user) navigate("/auth");
    // else navigate("/");
  }, [authState.user, navigate]);

  console.log(authState.user);

  return children;
};
