import { useState } from "react";
import { createThreadSchema, CreateThreadType } from "../api/create-thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { BsFillTagsFill } from "react-icons/bs";

import { useGetUserCommunities } from "../api/get-user-communities";

import { TextEditor } from "@/components/shared/text-editor";
import { Avatar, AvatarImage  } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface CreateThreadFormProp {
  initialTitleVal?: string;
  userId: string;
  handleFormSubmit: (data: FormData) => void;
}

// TODO finalize data when submitting

export const CreateThreadForm = ({
  handleFormSubmit,
  initialTitleVal,
  userId,
}: CreateThreadFormProp) => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  // const [previewContent, setPreviewContent] = useState<string>("");

  const {data: communities} = useGetUserCommunities({ userId: userId });

  const { register, handleSubmit, setValue } = useForm<CreateThreadType>({
      resolver: zodResolver(createThreadSchema),
  });

  
  console.log(communities);

  
  const onSubmit = (data: FieldValues) => {
    const formData = new FormData();
    formData.append("createdBy", userId);
    formData.append("communityId", selectedCommunity === "none" ? "" : selectedCommunity);
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
      //setPreviewContent(data.content); 
    }
    setValue("attachment", data.attachment || null);
  };

  const handleTagAddition = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleTagRemoval = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };


  // md:grid-cols-[2.5fr_1fr]
  return (
    <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr]  gap-4 rounded-lg py-2 ">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pb-4 text-primary-foreground bg-primary rounded-lg"
      >
        <div className="p-6  rounded-lg space-y-4">
        
          <div className="flex py-2 px-3 justify-between rounded-lg items-center gap-3 border dark:border-gray-500">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJR87LhAQLHCyOgunM1HObOBjHB9eJPwbBRA&s"
                  className="object-cover"
                />
              </Avatar>
              
              <div className="flex items-center flex-col gap-0">
                <h2 className="font-semibold">Kidla Sherlock</h2>
                <small className="text-muted-foreground">kidlat@gmail.com</small>
              </div>
            </div>

            <img
                src="https://banner2.cleanpng.com/20180610/jeu/aa8r2y6ex.webp"
                alt="account"
                className="w-[30px] h-[30px] rounded-full object-cover"
              />
          </div>

        {/* Content Editor Section */}
        <div className="p-6  rounded-lg border dark:border-gray-500 text-sm">
          {/* Community Selector */}
          <h2 className="font-semibold mb-1">Community</h2>
          <Select
            onValueChange={(val: string) => setSelectedCommunity(val)}  
                      
          >
            <SelectTrigger className="w-[180px] focus:border-accent bg-primary dark:border-gray-500">
              <SelectValue placeholder="Comm" />
            </SelectTrigger>
            <SelectContent
              className="bg-background border-none overflow-y-hidden"
            >
              <SelectItem value={"none"}>
                <p>None</p>
              </SelectItem>
              {communities && communities.map(comm => (
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



          <h2 className="font-semibold mt-3 mb-1">Title</h2>
          <input
              {...register("title")}
              className="w-full px-4 py-2 rounded-md outline-none focus:border-accent bg-primary 
            border-[1px] dark:border-gray-500"
              placeholder="Enter your title"
              defaultValue={initialTitleVal}
            />

          <h2 className=" font-semibold mt-3 mb-1">Content</h2>
          <TextEditor handleChange={handleContentChange} />
          {/* Hidden Inputs */}
          <input type="hidden" {...register("content")} />
          <input type="hidden" {...register("attachment")} />
        </div>


        {/* Tags Input */}
        <div className="p-6 border dark:border-gray-500 rounded-lg">
            <h3>Tags</h3>
            <div className="flex items-center border rounded-md mt-2 dark:border-gray-500">
              <BsFillTagsFill 
                className="text-accent ml-4"
              />
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                className="w-full px-4 py-2 rounded-md outline-none focus:border-accent 
              border-[1px]  border-none text-sm bg-primary "
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleTagAddition((e.target as HTMLInputElement).value.trim());
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap mt-4 gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
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
        <div className="flex justify-end mr-5">
          <Button
            type="submit"
            className="bg-accent text-accent-foreground"
          >
            Create Post
          </Button>
        </div>
      </form>

      {/* Preview Panel */}
      {/* <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg h-fit">
        <h2 className="text-lg font-semibold mb-4">Post Preview</h2>
        <div className="space-y-4">
         
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Community:</span>{" "}
            {selectedCommunity || "None selected"}
          </p>

          
          <h3 className="text-xl font-bold">{title || "No Title Yet"}</h3>

         
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

       
          <div
            className="mt-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
            dangerouslySetInnerHTML={{
              __html: previewContent || "<p>No content added yet</p>",
            }}
          />
        </div>
      </div> */}
    </div>
  );
};
