import { TextEditor } from "@/components/shared/text-editor";
import {
  CreateThreadType,
  useCreateComment,
} from "@/features/thread/api/create-comment";
import { useAuth } from "@/hooks/use-auth";
import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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

  const [commentData, setCommentData] = useState<CreateThreadType>({
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
    setIsFocused(false);
  };

  const handleCancel = () => {
    if (commentData.content !== "" && commentData.content !== "<p><br></p>") {
      const isDiscard = confirm(
        "Are you sure you want to discard your unsaved changes?"
      );

      if (isDiscard) {
        setIsFocused(false);
        setCommentData({ content: "", createdBy: "" });
        return;
      }
    }

    setIsFocused(false);
  };

  const handleContentChange = (data: Partial<CreateThreadType>) => {
    setCommentData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  return (
    <form className="bg-card rounded-lg shadow-sm" onSubmit={onSubmit}>
      <AnimatePresence>
        {isComment || isFocused ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <TextEditor
              handleChange={handleContentChange}
              placeholder={placeholder}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  commentData.content === "" ||
                  commentData.content === "<p><br></p>"
                }
              >
                Post
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="p-4">
            <input
              type="text"
              className="w-full bg-background rounded-md text-sm py-2 px-4 outline-none border border-input focus:border-primary transition-colors"
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
            />
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};

