import { useCallback, useEffect, useState } from "react";
import { createThreadSchema, CreateThreadType } from "../api/create-thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { BsFillTagsFill } from "react-icons/bs";
import { IoLogoGithub } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

import { useGetUserCommunities } from "../api/get-user-communities";

import { TextEditor } from "@/components/shared/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Thread, User } from "@/types";
import { useNavigate } from "react-router-dom";
import { handleFormErrors } from "@/utils";
import { useGetTopics } from "@/features/topic/api";

interface ThreadFormProp {
  thread?: Thread;
  initialTitleVal?: string;
  user: User;
  handleFormSubmit: (data: FormData) => void;
}

export const ThreadForm = ({
  thread,
  handleFormSubmit,
  initialTitleVal,
  user,
}: ThreadFormProp) => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<string>("");

  const { data: communities } = useGetUserCommunities({ userId: user.id });
  const { data: topics } = useGetTopics({});

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch } = useForm<CreateThreadType>(
    {
      resolver: zodResolver(createThreadSchema),
    },
  );

  console.log(communities);

  const title = watch("title", initialTitleVal || thread?.title || "");
  const content = watch("content", initialTitleVal || thread?.content || "");

  useEffect(() => {
    if (!thread || !thread.tags) return;

    setTags([...thread.tags.map((tag) => tag.name)]);
  }, [thread, thread?.tags]);

  useEffect(() => {
    if (!thread?.communityId) return;

    setSelectedCommunity(thread.communityId);
  }, [thread?.communityId]);

  useEffect(() => {
    if (!thread?.topicId) return;

    setSelectedTopic(thread.topicId);
  }, [thread?.topicId]);

  const handleTagAddition = useCallback(
    (tag: string) => {
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
    },
    [tags],
  );

  const handleTagRemoval = useCallback(
    (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    },
    [tags],
  );

  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("createdBy", user?.id.toString());
    if (selectedCommunity !== "none" && selectedCommunity !== "") {
      formData.append("communityId", selectedCommunity);
    }
    if (selectedTopic !== "none" && selectedTopic !== "") {
      formData.append("topicId", selectedTopic);
    }
    formData.append("tags", JSON.stringify(tags));

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    console.log(formData);

    handleFormSubmit(formData);
  };

  const handleContentChange = (data: Partial<CreateThreadType>) => {
    if (data.content) {
      setValue("content", data.content);
      setPreviewContent(data.content);
    }
    setValue("attachment", data.attachment || null);
  };

  if (!user) return <p>Loading...</p>;

  const handleCancel = () => {
    const hasUnsavedChanges =
      title || (content !== "" && content !== "<p><br></p>") || tags.length > 0;

    if (hasUnsavedChanges) {
      const isDiscard = confirm(
        "Are you sure you want to discard your unsaved changes?",
      );
      if (isDiscard) {
        navigate("/");
        return;
      }
    }

    navigate("/");
  };
  // md:grid-cols-[2.5fr_1fr]
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr]  gap-4 rounded-lg py-2 ">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit, handleFormErrors)}
        className="pb-4 text-primary-foreground bg-primary rounded-lg"
      >
        <div className="p-6  rounded-lg space-y-4">
          <div className="flex py-2 px-3 justify-between rounded-lg items-center gap-3 border dark:border-gray-500">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.attachment} className="object-cover" />
                <AvatarFallback />
              </Avatar>

              <div className="flex items-start flex-col gap-0">
                <h2 className="font-semibold">{user.name}</h2>
                <small className="text-muted-foreground">{user.email}</small>
              </div>
            </div>

            <div>
              {user.provider === "GOOGLE" ? (
                <FcGoogle className="text-3xl" />
              ) : (
                <IoLogoGithub className="text-3xl text-black" />
              )}
            </div>
          </div>

          <div className="p-6  rounded-lg border dark:border-gray-500 text-sm">
            {/* Community Selector */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-semibold mb-1">Community</h2>
                <Select
                  onValueChange={(val: string) => setSelectedCommunity(val)}
                  value={selectedCommunity}
                >
                  <SelectTrigger className="w-[180px] focus:border-accent bg-primary dark:border-gray-500">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-none overflow-y-hidden">
                    <SelectItem value={"none"}>
                      <p>None</p>
                    </SelectItem>
                    {communities &&
                      communities.map((comm) => (
                        <SelectItem
                          key={comm.id}
                          value={comm.id}
                          className="outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={comm.icon}
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
              {/* Topic Selector */}
              <div>
                <h2 className="font-semibold mb-1">Topic</h2>
                <Select
                  onValueChange={(val: string) => setSelectedTopic(val)}
                  value={selectedTopic}
                >
                  <SelectTrigger className="w-[180px] focus:border-accent bg-primary dark:border-gray-500">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-none overflow-y-hidden">
                    <SelectItem value={"none"}>
                      <p>None</p>
                    </SelectItem>
                    {topics &&
                      topics.map((topic) => (
                        <SelectItem
                          key={topic.id}
                          value={topic.id}
                          className="outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={topic.attachment}
                              alt="icon"
                              className="w-[20px] h-[20px] rounded-full"
                            />
                            <p className="">{topic.name.substring(0, 12)}</p>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h2 className="font-semibold mb-1 mt-3">Title</h2>

            <input
              {...register("title")}
              className="w-full px-4 py-2 rounded-md outline-none focus:border-accent bg-primary 
            border-[1px] dark:border-gray-500"
              placeholder="Enter your title"
              defaultValue={initialTitleVal || thread?.title || initialTitleVal}
            />

            <h2 className=" font-semibold mb-1 mt-3">Content</h2>

            <TextEditor
              initialContent={thread?.content || ""}
              handleChange={handleContentChange}
            />
            {/* Hidden Inputs */}
            <input type="hidden" {...register("content")} />
            <input type="hidden" {...register("attachment")} />
          </div>

          {/* Tags Input */}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mr-5 gap-3">
          <Button
            onClick={handleCancel}
            type="button"
            className="bg-container hover:bg-accent hover:text-accent-foreground  
            border-2 border-slate-300  dark:border-none"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-accent text-accent-foreground">
            {thread ? "Edit Post" : "Create Post"}
          </Button>
        </div>
      </form>

      {/* Preview Panel */}
      <div className="p-6 text-primary-foreground bg-primary shadow-md rounded-lg h-fit">
        <h2 className="text-lg font-semibold mb-4">Post Preview</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Community:</span>{" "}
            {selectedCommunity || "None selected"}
          </p>

          <h3 className="text-xl font-bold">{title || "No Title Yet"}</h3>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-accent text-white rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className="mt-4 border rounded-md p-4 bg-primary  dark:border-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: previewContent || "<p>No content added yet</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
};
