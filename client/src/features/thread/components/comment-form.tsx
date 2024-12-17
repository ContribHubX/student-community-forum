import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextEditor } from "@/components/shared/text-editor";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  CreateThreadType,
  useCreateComment,
} from "@/features/thread/api/create-comment";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateComment } from "../api/update-comment";


interface CommentFormProps {
  threadId: string | undefined;
  parentId?: string | undefined;
  placeholder: string;
  isComment?: boolean;
  isReply?: boolean;
  onSubmitCallback?: () => void;
  onCancelCallback?: () => void;
  isUpdate?: boolean;
  commentId?: string;
  updateContent?: string;
}

export const CommentForm = ({
  threadId,
  parentId,
  placeholder,
  isComment = false,
  isReply,
  isUpdate = false,
  commentId,
  updateContent,
  onSubmitCallback,
  onCancelCallback
}: CommentFormProps) => {
  const [showEditor, setShowEditor] = useState(isUpdate ? isUpdate : false);

  const { authState } = useAuth();

  const [commentData, setCommentData] = useState<CreateThreadType>({
    content: updateContent || "",
    createdBy: "",
  });

  const { mutate: createComment } = useCreateComment({
    mutationConfig: {
      onSuccess: (response) => {
        toast.success(response.message);
        setCommentData({
          content: "",
          createdBy: "",
        });
        setShowEditor(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });

  const { mutate: updateComment } = useUpdateComment({
   mutationConfig: {
    onSuccess: () => {
      toast.success("Comment Updated");
      onCancelCallback?.()
    }
   }
  });  

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      content: commentData.content,
      createdBy: authState.user?.id.toString(),
      threadId: threadId,
      parentId: parentId ? parentId : null,
    };

    if (!isUpdate)  
      createComment(data);
    else {
      updateComment({ id: commentId || "", 
                      content: commentData.content,
                      updatedBy: authState.user?.id.toString() || ""
      })
    }

    if (onSubmitCallback) onSubmitCallback();
  };

  const handleCancel = () => {
    if (commentData.content !== "" && commentData.content !== "<p><br></p>") {
      const isDiscard = confirm(
        "Are you sure you want to discard your unsaved changes?",
      );

      if (isDiscard) {
        setCommentData({ content: "", createdBy: "" });
        return;
      }
    }
    setShowEditor(false);
    onCancelCallback?.();
  };

  const handleContentChange = (data: Partial<CreateThreadType>) => {
    setCommentData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  return (
    <form
      className="text-primary-foreground rounded-lg bg-primary shadow-sm"
      onSubmit={onSubmit}
    >
      <AnimatePresence>
        {isComment || isReply || showEditor ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <TextEditor
              handleChange={handleContentChange}
              placeholder={placeholder}
              initialContent={commentData.content}
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
                className="text-accent-foreground"
                disabled={
                  commentData.content === "" ||
                  commentData.content === "<p><br></p>"
                }
              >
                {isUpdate ? "Update": "Create"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="p-4">
            <input
              type="text"
              className="w-full bg-background rounded-md text-sm py-2 px-4 outline-none border border-input focus:border-primary transition-colors"
              placeholder={placeholder}
              onClick={() => setShowEditor(true)}
              onFocus={() => setShowEditor(true)}
            />
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};
