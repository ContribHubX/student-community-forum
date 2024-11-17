import { modules } from "@/components/shared/text-editor";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/features/thread/api/create-comment";
import { useAuth } from "@/hooks/use-auth";
import { FormEvent, useState } from "react";
import ReactQuill from "react-quill";

interface CommentFormProps {
  threadId: string | undefined;
}

export const CommentForm = ({ threadId }: CommentFormProps) => {
  const { authState } = useAuth();
  const [content, setContent] = useState("");

  const { mutate: createComment } = useCreateComment({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = {
      content: content,
      createdBy: authState.user?.id,
      threadId: threadId,
      parentId: null,
    };
    console.log(data);
    createComment(data);
  };

  return (
    <form
      action=""
      className="text-primary-foreground bg-primary p-4 border border-opacity-25 border-slate-600 flex flex-col gap-4 mt-4
      rounded-xl"
      onSubmit={onSubmit}
    >
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        className="max-h-[200px] overflow-y-auto bg-primary"
        placeholder="Write a comment here"
      />

      <div className="space-x-2 self-end">
        <Button className="font-light text-sm bg-background border border-opacity-25 border-slate-600">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={content === "" || content === "<p><br></p>"}
          className="px-6 font-light text-sm text-accent-foreground
          
        "
        >
          Save
        </Button>
      </div>
    </form>
  );
};
