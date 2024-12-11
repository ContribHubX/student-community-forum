import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { tasks } from "../data/tasks";
import { useGetTodos, getTodosQueryOptions } from "../api/get-todos";
import { useCreateTodo } from "../api/create-todo";
import { useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/types";
import { useUpdateTodo } from "../api/update-todo";

interface TodosProp {
  userId: string;
}

export const Todos = ({ userId }: TodosProp) => {
  const queryClient = useQueryClient();
  const { data: todos } = useGetTodos({ userId: userId || "" });

  const { mutate: createTodo } = useCreateTodo({
    mutationConfig: {
      onSuccess: (data) => {
        queryClient.setQueryData(
          getTodosQueryOptions(data.createdBy.toString()).queryKey,
          (oldTodos: Todo[] | undefined) => {
            return oldTodos ? [data, ...oldTodos] : undefined;
          },
        );
      },
    },
  });

  console.log(todos)

  const { mutate: updateTodo } = useUpdateTodo({
    mutationConfig: {
      onSuccess: (data) => {
        queryClient.setQueryData(
          getTodosQueryOptions(userId.toString()).queryKey,
          (oldTodos: Todo[] | undefined) => {
            return oldTodos?.map((todo) => {
              if (todo.id === data.id) todo = { ...data };
              return todo;
            });
          },
        );
      },
    },
  });

  const handleSubmit = (name: string) => {
    createTodo({ name, createdBy: userId.toString() });
  };

  const handleCheckboxChange = (taskId: string, currentStatus: boolean) => {
    updateTodo({
      todoId: taskId,
      isDone: !currentStatus,
    });
  };

  return (
    <div className="text-sm rounded-2xl bg-primary md:max-w-[261px] shadow-xl">
      <div className="bg-[#bd8322] p-3 text-accent-foreground rounded-t-2xl">
        <Select>
          <SelectTrigger className="text-[.8rem] max-w-[80px] p-0 flex font-medium bg-transparent border-0 px-0 h-4">
            <SelectValue placeholder="My Task" />
          </SelectTrigger>
          <SelectContent className="border-0 ">
            <SelectItem value="group">Group Task</SelectItem>
            <SelectItem value="personl">My Task</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-4 pb-2">
        <ScrollArea className="max-h-[150px]">
          <div className="flex flex-col gap-3">
            {[...(todos || []), ...tasks].map((task) => (
              <div
                key={task.id}
                className="flex items-center  text-primary-foreground gap-3"
              >
                <Checkbox
                  id={task.id}
                  className="border-bg-primary"
                  checked={task.isDone}
                  onCheckedChange={() =>
                    handleCheckboxChange(task.id, task.isDone)
                  }
                />
                <label
                  htmlFor={task.id}
                  className={`text-[.8rem] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${task.isDone && "line-through"}`}
                >
                  {task.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-2">
          <TodoForm handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

interface TodoFormProp {
  handleSubmit: (name: string) => void;
}

const TodoForm = ({ handleSubmit }: TodoFormProp) => {
  const [todo, setTodo] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(todo);
    setTodo("");
  };

  return (
    <form
      className="flex items-center gap-2 text-accent-foreground"
      onSubmit={onSubmit}
    >
      <p className="text-xl">+</p>
      <input
        type="text"
        value={todo}
        placeholder="Add new task"
        className="bg-transparent border-0 outline-none text-[.8rem]"
        onChange={(e) => {
          setTodo(e.target.value);
        }}
      />
    </form>
  );
};
