import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Comment } from "@/types";
import "react-quill/dist/quill.snow.css";
import { CommentReplyList } from "./comment-reply-list";
import { CommentForm } from "@/features/thread/components/comment-form";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="bg-primary rounded-xl text-primary-foreground">
      <div className={`p-4 flex flex-col"}`}>
        <div className="space-y-3">
          <div className="flex gap-2 items-center text-sm text-gray-600">
            <Avatar className="">
              <AvatarImage
                src={comment.createdBy.attachment}
                className="rounded-full h-10"
              />
            </Avatar>
            <p>{comment.createdBy.name}</p>
            <p>{new Date(comment.createdAt).toDateString()}</p>
          </div>

          <div>
            <p
              className=""
              dangerouslySetInnerHTML={{ __html: comment?.content }}
            />
          </div>
        </div>
      </div>

      {comment?.replies?.length > 0 && (
        <CommentReplyList replies={comment?.replies} />
      )}

      <CommentForm
        threadId={comment.threadId}
        parentId={comment.id}
        placeholder="Write your reply here"
      />
      {/* <form
        action=""
        className="p-4 border-t border-opacity-25 border-slate-600 flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          className="max-h-[200px] overflow-y-auto"
        />

        <div className="space-x-2 self-end">
          <Button className="font-light text-sm bg-background border border-opacity-25 border-slate-600">
            Cancel
          </Button>
          <Button
            disabled={value === "" || value === "<p><br></p>"}
            className="px-6 font-light text-sm text-accent-foreground
        "
          >
            Save
          </Button>
        </div>
      </form> */}
    </div>
  );
};
