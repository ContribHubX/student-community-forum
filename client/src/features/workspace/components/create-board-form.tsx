import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  createBoardSchema,
  CreateBoardType,
  useCreateBoard,
} from "../api/create-board";

interface CreateBoardFormProp {
  userId: string | undefined;
}

export const CreateBoardForm = ({ userId }: CreateBoardFormProp) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardType>({
    resolver: zodResolver(createBoardSchema),
  });
  const { mutate: createBoard } = useCreateBoard({});

  const onSubmit: SubmitHandler<CreateBoardType> = async (
    data: CreateBoardType,
  ) => {
    setIsSubmitting(true);
    createBoard({ ...data, createdBy: (userId || "").toString() });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    reset();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-8 w-full max-w-md mx-auto p-8 rounded-lg text-primary-foreground"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="">
        <input
          {...register("name")}
          className="w-full px-4 py-2 rounded-md border border-input bg-background text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
          placeholder="Enter board name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full py-2 px-4 text-primary-foreground hover:bg-accent bg-background hover:text-accent-foreground rounded-md transition duration-200 ease-in-out"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <motion.div
            className="h-5 w-5 rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          "Create Board"
        )}
      </Button>
    </motion.form>
  );
};
