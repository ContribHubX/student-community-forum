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
    </div>
  );
};
