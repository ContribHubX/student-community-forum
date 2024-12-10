import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextEditor } from "@/components/shared/text-editor"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { CreateThreadType, useCreateComment } from "@/features/thread/api/create-comment"
import { useAuth } from "@/hooks/use-auth"

interface CommentFormProps {
  threadId: string | undefined
  parentId?: string | undefined
  placeholder: string
  isComment?: boolean
  onSubmitCallback?: () => void
}

export const CommentForm = ({
  threadId,
  parentId,
  placeholder,
  isComment = false,
  onSubmitCallback,
}: CommentFormProps) => {
  const [showEditor, setShowEditor] = useState(false)
  const { authState } = useAuth()

  const [commentData, setCommentData] = useState<CreateThreadType>({
    content: "",
    createdBy: "",
  })

  const { mutate: createComment } = useCreateComment({
    mutationConfig: {
      onSuccess: (response) => {
        toast.success(response.message)
        setCommentData({
          content: "",
          createdBy: "",
        })
        setShowEditor(false)
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message)
        }
      },
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      content: commentData.content,
      createdBy: authState.user?.id.toString(),
      threadId: threadId,
      parentId: parentId ? parentId : null,
    }
    createComment(data)

    if (onSubmitCallback) onSubmitCallback()
  }

  const handleCancel = () => {
    if (commentData.content !== "" && commentData.content !== "<p><br></p>") {
      const isDiscard = confirm(
        "Are you sure you want to discard your unsaved changes?"
      )

      if (isDiscard) {
        setShowEditor(false)
        setCommentData({ content: "", createdBy: "" })
        return
      }
    }

    setShowEditor(false)
  }

  const handleContentChange = (data: Partial<CreateThreadType>) => {
    setCommentData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  return (
    <form
      className="text-primary-foreground rounded-lg bg-primary shadow-sm"
      onSubmit={onSubmit}
    >
      <AnimatePresence>
        {isComment || showEditor ? (
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
              onClick={() => setShowEditor(true)}
              onFocus={() => setShowEditor(true)}
            />
          </div>
        )}
      </AnimatePresence>
    </form>
  )
}

