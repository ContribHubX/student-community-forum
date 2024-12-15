import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, FormSchema, registerSchema } from "../api/register";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { mutate: registerUser } = useRegister({
    mutationConfig: {
      onSuccess: (data) => {
        toast.success(data.message);
        reset();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });

  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (file) {
      formData.append("attachment", file);
    }

    try {
      registerUser(formData);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <Input
          {...register("name")}
          id="name"
          placeholder="John Doe"
          className="bg-[#eff5f8]  focus-visible:ring-[#533de0] focus-visible:ring-offset-0"
        />
      </div>
      <div className="space-y-2 ">
        <Label htmlFor="email">Email</Label>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="john@example.com"
          className="bg-[#eff5f8]  focus-visible:ring-[#533de0] focus-visible:ring-offset-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <Input
          {...register("password")}
          id="password"
          type="password"
          className="bg-[#eff5f8]  focus-visible:ring-[#533de0] focus-visible:ring-offset-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">Profile Picture</Label>
        {errors.attachment && (
          <p className="text-red-500 text-sm">{errors.attachment.message}</p>
        )}
        <Input
          className="bg-[#eff5f8] file:text-black"
          id="attachment"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
              setValue("attachment", file);
            }
          }}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign up"}
      </Button>
    </motion.form>
  );
};
