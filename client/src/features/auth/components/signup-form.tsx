import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, FormSchema, registerSchema } from "../api/register";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: registerUser } = useRegister({});
  const { handleSubmit, register, reset, setValue } = useForm<FormSchema>({
    resolver: zodResolver(registerSchema),
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
      reset();
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
        <Input {...register("name")} id="name" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input {...register("password")} id="password" type="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="attachment">Profile Picture</Label>
        <Input
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
