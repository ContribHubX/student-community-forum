import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextEditor } from "@/components/shared/text-editor";
import { Button } from "@/components/ui/button";

import { Topic } from "@/types";

import { createThreadSchema, CreateThreadType } from "../api/create-thread";
import { useGetTopics } from "@/features/topic/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateQuestionFormProp {
  initialTopic?: Topic;
  initialTitleVal?: string;
  userId: string;
  handleFormSubmit: (data: FormData) => void;
}

export const CreateQuestionForm = ({
  initialTopic,
  handleFormSubmit,
  initialTitleVal,
  userId,
}: CreateQuestionFormProp) => {
  const [, setThreadData] = useState<CreateThreadType>({} as CreateThreadType);
  const { register, handleSubmit, setValue } = useForm<CreateThreadType>({
    resolver: zodResolver(createThreadSchema),
  });
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { data: topics } = useGetTopics({});

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("createdBy", userId);
    formData.append("topicId", selectedTopic || "");

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    console.log(formData);

    // Submit the form
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" dark:bg-gray-800 rounded-lg  space-y-6 text-primary-foreground"
    >
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          {...register("title")}
          id="title"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-accent focus:border-accent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
          placeholder="Enter your question title..."
          defaultValue={initialTitleVal || ""}
        />
      </div>

      <div className="relative">
        <Select onValueChange={(val: string) => setSelectedTopic(val)}>
          <SelectTrigger className="w-full focus:border-accent bg-primary px-4 py-6 dark:border-gray-500">
            {selectedTopic || initialTopic ? (
              <div className="flex items-center gap-3">
                <img
                  src={
                    topics?.find((topic) => topic.id === selectedTopic)
                      ?.attachment || initialTopic?.attachment
                  }
                  alt="attachment"
                  className="w-[25px] h-[25px] rounded-full"
                />
                <p>
                  {topics?.find((topic) => topic.id === selectedTopic)?.name ||
                    initialTopic?.name}
                </p>
              </div>
            ) : (
              <SelectValue placeholder="Select Topic" />
            )}
          </SelectTrigger>
          <SelectContent className="bg-background border-none overflow-y-hidden">
            <SelectItem value={"none"}>
              <p>None</p>
            </SelectItem>
            {topics &&
              topics.map((comm) => (
                <SelectItem
                  key={comm.id}
                  value={comm.id}
                  className="outline-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={comm.attachment}
                      alt="icon"
                      className="w-[20px] h-[20px] rounded-full"
                    />
                    <p>{comm.name}</p>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Content
        </label>
        <TextEditor handleChange={handleContentChange} />
        <input type="hidden" {...register("content")} />
        <input type="hidden" {...register("attachment")} />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition duration-300"
        >
          Create
        </Button>
      </div>
    </form>
  );
};
