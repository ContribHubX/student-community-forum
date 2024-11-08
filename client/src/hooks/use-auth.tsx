import { useContext } from "react";
import { AuthContext } from "@/providers/auth/context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw Error("App must be wrap within socket context");

  return context;
};