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
import { BsFillTagsFill } from "react-icons/bs";
import { handleFormErrors } from "@/utils";

interface CreateQuestionFormProp {
  initialTopic?: Topic;
  initialTitleVal?: string;
  initialContent?: string;
  userId: string;
  handleFormSubmit: (data: FormData) => void;
  taggable?: boolean;
  action?: "edit" | "create";
}

export const CreateQuestionForm = ({
  initialTopic,
  handleFormSubmit,
  initialTitleVal,
  initialContent,
  userId,
  taggable = false,
  action = "create",
}: CreateQuestionFormProp) => {
  const [, setThreadData] = useState<CreateThreadType>({} as CreateThreadType);
  const [tags, setTags] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch } = useForm<CreateThreadType>({
    resolver: zodResolver(createThreadSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const content = watch("content", initialContent || "");

  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic?.id || "",
  );
  const { data: topics } = useGetTopics({});

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("createdBy", userId);
    formData.append("topicId", selectedTopic || "");

    if (taggable) formData.append("tags", JSON.stringify(tags));

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    // Submit the form
    handleFormSubmit(formData);
  };

  const handleTagAddition = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleTagRemoval = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
      onSubmit={handleSubmit(onSubmit, handleFormErrors)}
      className="bg-primary rounded-lg  space-y-6 text-primary-foreground"
    >
      {/* Title Input */}
      <div>
        <div>
          <label
            htmlFor="title"
            className={`block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Title
          </label>
        </div>
        <input
          {...register("title")}
          id="title"
          className={`w-full px-4 py-3 rounded-lg border bg-gray-100 dark:bg-primary focus:ring-accent focus:border-accent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400
            border-gray-300 dark:border-gray-600 `}
          placeholder="Enter your question title..."
          defaultValue={initialTitleVal || ""}
        />
      </div>

      <div className="relative">
        <Select onValueChange={(val: string) => setSelectedTopic(val)}>
          <SelectTrigger className="w-full focus:border-accent bg-primary px-4 py-6 dark:bg-primary border-gray-300 dark:border-gray-600 bg-gray-100">
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
        <TextEditor 
          handleChange={handleContentChange} 
          initialContent={initialContent || ""}
        />
        <input type="hidden" {...register("content")} />
        <input type="hidden" {...register("attachment")} />
      </div>

      {/* Tag section */}
      {taggable && (
        <div className="p-6 border dark:border-gray-500 rounded-lg">
          <h3>Tags</h3>
          <div className="flex items-center border rounded-md mt-2 dark:border-gray-500">
            <BsFillTagsFill className="text-accent ml-4" />
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              className="w-full px-4 py-2 rounded-md outline-none focus:border-accent 
          border-[1px]  border-none text-sm bg-primary "
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleTagAddition(
                    (e.target as HTMLInputElement).value.trim(),
                  );
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
          <div className="flex flex-wrap mt-4 gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemoval(tag)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition duration-300"
        >
          {action === "create" ? "Create" : "Edit"}
        </Button>
      </div>
    </form>
  );
};
