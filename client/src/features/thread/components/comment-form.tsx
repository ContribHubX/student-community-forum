import { TextEditor } from "@/components/shared/text-editor";
import {
  CreateCommentType,
  useCreateComment,
} from "@/features/thread/api/create-comment";
import { useAuth } from "@/hooks/use-auth";
import { FormEvent, useState } from "react";

import { motion } from "framer-motion";

interface CommentFormProps {
  threadId: string | undefined;
  parentId?: string | undefined;
  placeholder: string;
  isComment?: boolean;
}

export const CommentForm = ({
  threadId,
  parentId,
  placeholder,
  isComment = false,
}: CommentFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { authState } = useAuth();

  const [commentData, setCommentData] = useState<CreateCommentType>({
    content: "",
    createdBy: "",
  });

  const { mutate: createComment } = useCreateComment({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = {
      content: commentData.content,
      createdBy: authState.user?.id.toString(),
      threadId: threadId,
      parentId: parentId ? parentId : null,
    };
    createComment(data);
    setCommentData({
      content: "",
      createdBy: "",
    });
  };

  const handleCancel = () => {
    if (commentData.content !== "" && commentData.content !== "<p><br></p>") {
      const isDiscard = confirm(
        "Are you sure you want to discard your unsaved changes?",
      );

      if (isDiscard) {
        setIsFocused(!isFocused);
        return;
      }
    }

    setIsFocused(!isFocused);
  };

  const handleContentChange = (data: Partial<CreateCommentType>) => {
    setCommentData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  return (
    <form
      action=""
      className="text-primary-foreground bg-primary rounded-xl"
      onSubmit={onSubmit}
    >
      {isComment ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-2 flex flex-col gap-2"
        >
          <TextEditor
            handleChange={handleContentChange}
            placeholder={placeholder}
          />
          <div className="space-x-2 self-end">
            <button
              className="font-light text-sm bg-background border border-opacity-25 border-slate-600
          px-4 py-1 rounded-xl"
              type="reset"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                commentData.content === "" ||
                commentData.content === "<p><br></p>"
              }
              className="bg-accent px-6 py-1 font-light text-sm text-accent-foreground rounded-xl
              disabled:brightness-75"
            >
              Save
            </button>
          </div>
        </motion.div>
      ) : isFocused ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-2 pb-2 flex flex-col gap-2 "
        >
          <TextEditor
            handleChange={handleContentChange}
            placeholder={placeholder}
          />
          <div className="space-x-2 self-end">
            <button
              className="font-light text-sm bg-background 
          px-4 py-1 rounded-xl"
              type="reset"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                commentData.content === "" ||
                commentData.content === "<p><br></p>"
              }
              className="bg-accent px-6 py-1 font-light text-sm text-accent-foreground rounded-xl
              disabled:brightness-75"
            >
              Save
            </button>
          </div>
        </motion.div>
      ) : (
        <div
          className="w-full rounded-md
        px-2 pb-2 "
        >
          <input
            type="text"
            name=""
            id=""
            className="w-full bg-background rounded-xl text-sm py-2 px-4 outline-none"
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      )}
    </form>
  );
};
