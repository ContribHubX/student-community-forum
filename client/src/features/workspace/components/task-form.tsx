/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { FlexContainer } from "@/components/ui/flex-container";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { statusColors } from "../constant";

import { MdOutlineNoteAlt } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { BsPeople } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useGetBoardMembers } from "../api/get-board-members";
import { Task, TaskStatusType, User } from "@/types";
import { CreateTaskSchema, useCreateTask } from "../api/create-task";
import { UpdateTaskType, useUpdateTask } from "../api/update-task";
import { extractFileName, formDataToObject } from "@/utils";

interface TaskFormProp {
  currentUserId?: string;
  boardId: string;
  type: string;
  initialTask?: Task;
  onCancel?: () => void;
}

export const TaskForm = ({
  currentUserId,
  boardId,
  type,
  initialTask,
  onCancel,
}: TaskFormProp) => {
  const { isDark } = useTheme();
  const { data: members } = useGetBoardMembers({ boardId: boardId || "" });
  const { mutate: createTask } = useCreateTask({});
  const { mutate: updateTask } = useUpdateTask({});
  const [fileName, setFileName] = useState("");

  const [formState, setFormState] = useState<CreateTaskSchema>({
    name: "",
    description: "",
    attachment: null,
    status: type as TaskStatusType,
    createdBy: currentUserId || "",
    assignees: [],
    boardId,
  });

  useEffect(() => {
    if (initialTask) {
      setFormState({
        name: initialTask.name || "",
        description: initialTask.description || "",
        attachment: null,
        status: initialTask.status || (type as TaskStatusType),
        createdBy: initialTask.createdBy.id || currentUserId || "",
        assignees: initialTask.assignees || [],
        boardId: initialTask.boardId || boardId,
      });
    }

    if (
      initialTask?.attachment !== "" &&
      initialTask?.attachment !== undefined
    ) {
      setFileName(extractFileName(initialTask?.attachment));
    }
  }, [initialTask, type, currentUserId, boardId]);

  const { text, background } =
    statusColors[
      type === "todo" ? "archived" : type === "doing" ? "finished" : "active"
    ];

  const handleInputChange = (field: keyof CreateTaskSchema, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file?.name || "");
    handleInputChange("attachment", file);
  };

  const handleAddAssignee = (user: User) => {
    if (!formState.assignees?.find((assignee) => assignee.id === user.id)) {
      setFormState((prev) => ({
        ...prev,
        assignees: [...(prev.assignees || []), user],
      }));
    }
  };

  const handleRemoveAssignee = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      assignees: prev.assignees?.filter((assignee) => assignee.id !== id),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("description", formState.description);
    formData.append("attachment", formState.attachment || "");
    formData.append("status", type);
    formData.append("createdBy", currentUserId || "");
    formData.append("assignees", JSON.stringify(formState.assignees));
    formData.append("boardId", boardId);

    // Submit formData via an API request
    if (!initialTask) createTask(formData);
    else
      updateTask({
        ...formDataToObject(formData),
        taskId: initialTask.id,
        sequence: initialTask.sequence,
        isDragUpdate: false,
      } as UpdateTaskType);

    console.log(formData);
  };

  return (
    <FlexContainer
      direction="col"
      className="bg-primary rounded-md items-start text-primary-foreground text-[.8rem] p-3  max-w-[300px] shadow-md relative"
    >
      <FlexContainer className="justify-between">
        <small
          className="rounded-lg py-[5px] px-2 text-xs"
          style={{
            color: text,
            backgroundColor: !isDark ? background : "#1e252b",
          }}
        >
          {"todo"}
        </small>
      </FlexContainer>

      <form
        className="flex flex-col items-center gap-3 font-light text-[.8rem]"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-3 items-center">
          <MdOutlineNoteAlt className="text-xl" />
          <input
            type="text"
            placeholder="Task Name"
            value={formState.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="outline-none w-full  p-2 bg-background rounded-md"
          />
        </div>
        <div className="flex gap-3 items-start">
          <MdOutlineDescription className="text-xl" />
          <textarea
            placeholder="Enter Description"
            value={formState.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="outline-none w-full  p-2 bg-background rounded-md"
          />
        </div>

        <div className="w-full">
          {formState.assignees && formState.assignees?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formState.assignees.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 bg-background rounded-md"
                >
                  <Avatar className="w-[30px] h-[30px] rounded-full">
                    <AvatarImage
                      src={user.attachment}
                      className="object-cover"
                    />
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(user.id)}
                    className="text-red-500 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <Popover>
            <PopoverTrigger>
              <div className="flex gap-3 items-center w-full cursor-pointer">
                <BsPeople className="text-xl items-start" />
                <input
                  placeholder="Add responsible"
                  className={`${formState.assignees?.length && "hidden"} outline-none w-[60%] p-2 bg-background rounded-md`}
                />
                <FiPlus className="text-lg hover:text-accent" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-primary dark:border-gray-600 border-[1px]">
              <div className="flex flex-col gap-3">
                {members?.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleAddAssignee(user)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Avatar className="w-[30px] h-[30px] rounded-full">
                      <AvatarImage
                        src={user.attachment}
                        className="object-cover"
                      />
                    </Avatar>
                    <p className="text-[.8rem]">{user.name}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-3 items-center w-full">
          <CgAttachment className="text-xl" />
          <label className="outline-none w-full  p-2 bg-background rounded-md cursor-pointer flex items-center gap-2">
            <span className="text-gray-500">
              {fileName !== "" ? fileName : "Attach a file"}
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden w-full"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 self-end">
          <button
            type="button"
            className="bg-background text-primary-foreground px-3 py-2 rounded-md ml-auto"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-background text-primary-foreground px-3 py-2 rounded-md ml-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </FlexContainer>
  );
};
