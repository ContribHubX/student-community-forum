import { useState } from "react";
import { createThreadSchema, CreateThreadType } from "../api/create-thread";
import { TextEditor } from "@/components/shared/text-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface CreateThreadFormProp {
  initialTitleVal?: string;
  userId: string;
  handleFormSubmit: (data: FormData) => void;
}

export const CreateThreadForm = ({
  handleFormSubmit,
  initialTitleVal,
  userId,
}: CreateThreadFormProp) => {
  const [, setThreadData] = useState<CreateThreadType>({} as CreateThreadType);
  const { register, handleSubmit, setValue } = useForm<CreateThreadType>({
    resolver: zodResolver(createThreadSchema),
  });

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("createdBy", userId);

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    console.log(formData);

    // submit
    handleFormSubmit(formData);
  };

  const handleContentChange = (data: Partial<CreateThreadType>) => {
    setThreadData((prevData) => ({
      ...prevData,
      ...data,
    }));

    // Update form values
    if (data.content) setValue("content", data.content);
    setValue("attachment", data.attachment || null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-primary-foreground">
      <div>
        <input
          {...register("title")}
          className="w-full px-4 py-3 rounded-[10px]  outline-none focus:border-accent bg-background 
          border-[1px] border-gray-300 dark:border-gray-500"
          placeholder="Title"
          value={initialTitleVal}
        />
      </div>

      <div className="pt-3">
        <TextEditor handleChange={handleContentChange} />
      </div>

      {/* register hidden inputs */}
      <input type="hidden" {...register("content")} />
      <input type="hidden" {...register("attachment")} />

      <div className="mt-4 flex items-center justify-center">
        <Button
          type="submit"
          className="shrink-0  bg-accent text-accent-foreground p-3 px-4 text-sm rounded-md"
        >
          Create
        </Button>
      </div>
    </form>
  );
};