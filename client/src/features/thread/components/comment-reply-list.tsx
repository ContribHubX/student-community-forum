import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types";

interface CommentReplyListProps {
  replies: Comment[];
}

export const CommentReplyList = ({ replies }: CommentReplyListProps) => {
  return (
    <div className="">
      {replies.map((reply, index) => {
        return <CommentReplyItem reply={reply} key={index} />;
      })}
    </div>
  );
};

interface CommentReplyProps {
  reply: Comment;
}

const CommentReplyItem = ({ reply }: CommentReplyProps) => {
  return (
    <div className="p-4 border-b-2 space-y-2">
      <div className="flex gap-2 items-center text-sm text-gray-600">
        <Avatar className="">
          <AvatarImage
            className="rounded-full h-10"
            src={reply.createdBy.attachment}
          />
        </Avatar>
        <p>{reply.createdBy.name}</p>
        <p>{reply.createdAt.toDateString()}</p>
      </div>

      <div className="ml-12">
        <p>{reply.content}</p>
      </div>
    </div>
  );
};
