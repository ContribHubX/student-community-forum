import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogin, loginSchema, FormSchema } from "../api/login";
import { useAuth } from "@/hooks/use-auth";
import { OPERATION } from "@/providers/auth/context";
import { loginSocialProvider } from "../api/use-social-login";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const LoginForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { authDispatch } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginUser, isPending } = useLogin({
    mutationConfig: {
      onSuccess: (data) => {
        authDispatch({
          type: OPERATION.LOGIN_USER,
          payload: { user: data.user, accessToken: data.token },
        });
        navigate("/");
        toast.success("Login successfully!");
      },
      onError: (error) => {
        console.error("Login failed:", error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);

    try {
      loginUser(data);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="email" className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2 bg-[#eff5f8] ">
        <TabsTrigger
          className="text-[#858ead] aria-selected:bg-blue-300"
          value="email"
        >
          Email
        </TabsTrigger>

        <TabsTrigger
          className="text-[#858ead] aria-selected:text-[#533de0] aria-selected:font-bold aria-selected:bg-red-900"
          value="social"
        >
          Social
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="bg-[#eff5f8]  focus-visible:ring-[#533de0] focus-visible:ring-offset-0 dark:border-none dark:shadow-md"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-[#eff5f8]  focus-visible:ring-[#533de0] focus-visible:ring-offset-0 dark:border-none dark:shadow-md"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-white shadow-md hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Log in"}
          </Button>
        </motion.form>
      </TabsContent>
      <TabsContent value="social">
        <div className="space-y-4 ">
          <Button
            variant="outline"
            className="w-full bg-[#eff5f8] dark:border-none dark:shadow-md"
            onClick={() => loginSocialProvider("google")}
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-6 w-6">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full  dark:text-white dark:border-none dark:shadow-md"
            onClick={() => loginSocialProvider("github")}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
