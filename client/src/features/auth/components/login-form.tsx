import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuGithub } from "react-icons/lu";
import { z } from "zod";
import { loginSocialProvider } from "../api/useSocialLogin";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"), // Validates email format// Ensures email is not empty
  password: z.string().min(6, "Password must be at least 6 characters"), // Password length validation
});

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    if (errors) {
      //if errors
    }
    /// Login logic from server
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
  };

  if (errors.email) {
    console.log(errors.email.message);
  }
  return (
    <form
      action=""
      className="mt-14 space-y-10 w-full font-light text-base"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="space-y-5">
        {/* Email Input */}

        <div className="">
          <label>Email</label>
          <div>
            <input
              {...register("email")}
              className="bg-white w-full border-b-2 py-2 outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="">
          <label htmlFor="">Password</label>

          <div className="relative">
            <input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              className="bg-white w-full border-b-2 outline-none py-2 focus:border-accent "
              onFocus={() => setIsPasswordFocus(true)}
              onBlur={() => setIsPasswordFocus(false)}
            />

            {isPasswordFocus &&
              (isShowPassword ? (
                <FaEyeSlash
                  className="absolute right-3 bottom-3 text-xl cursor-pointer"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ) : (
                <FaEye
                  className="absolute right-3 bottom-3 text-xl cursor-pointer"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              ))}
          </div>
        </div>
      </fieldset>

      {/* Login Buttons */}
      <div className="flex flex-col gap-3 text-white">
        <Button
          className="font-light disabled:bg-[#808080]"
          type="submit"
          disabled={isSubmitting}
        >
          Log in
        </Button>

        <Button 
          className="font-light bg-[#F0F0F0] text-black" type="submit"
          onClick={() => loginSocialProvider("google")}
        >
          <FcGoogle />
          <span>Log in with Google</span>
        </Button>
        <Button className="font-light bg-[#333333]" 
          type="submit"
          onClick={() => loginSocialProvider("github")}
        >
          <LuGithub />
          <span>Log in with GitHub</span>
        </Button>
      </div>
    </form>
  );
};
