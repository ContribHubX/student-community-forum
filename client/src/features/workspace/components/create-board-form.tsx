import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { createBoardSchema, CreateBoardType, useCreateBoard } from "../api/create-board";


interface CreateBoardFormProp {
  userId: string | undefined;
}

export const CreateBoardForm = ({ userId }: CreateBoardFormProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateBoardType>({
    resolver: zodResolver(createBoardSchema),
  });
  const { mutate: createBoard } = useCreateBoard({});

  const onSubmit: SubmitHandler<CreateBoardType> = async (data: CreateBoardType) => {

   
     // if (errors) {
      
    // }
    // validate
    createBoard({...data, createdBy: userId || ""});

    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
  };

  if (errors.name) {
    console.log(errors.name.message);
  }
  return (
    <form
      action=""
      className="space-y-10 w-full font-light text-base"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="space-y-1">
      
        <div className="text-primary-foreground mb-6">
          <div className="flex  flex-col">
              <label className="font-semibold text-lg">Name</label>
              <small className="text-muted-foreground">Project name</small>
          </div>
          <div>
            <input
              {...register("name")}
              className=" mt-2 w-full border-b-2 py-2 outline-none focus:border-accent bg-background px-3"
            />
          </div>
        </div>

        <Button 
            className="text-sm font-normal w-full rounded-sm bg-background  hover:bg-accent hover:text-accent-foreground"
        >
            Continue
        </Button>
      </fieldset>
    </form>
  );
};
