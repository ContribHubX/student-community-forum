import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { OPERATION } from "@/providers/auth/context";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useParams } from "react-router-dom";

export const OAuthCallback = () => {
  const { authDispatch } = useAuth();
  const navigate = useNavigate();

  const { provider } = useParams();

  console.log("prov:" + provider);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const res = await api.get(
          `/api/auth/${provider}/callback${window.location.search}`,
        );
        authDispatch({ type: OPERATION.LOGIN_USER, payload: { ...res.data } });
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    };

    handleAuthCallback();
  }, [provider]);

  return <></>;
};