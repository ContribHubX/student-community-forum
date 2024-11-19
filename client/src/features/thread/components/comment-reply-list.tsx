import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types";

interface CommentReplyListProps {
  replies: Comment[];
}

export const CommentReplyList = ({ replies }: CommentReplyListProps) => {

  return (
    <div className="border-t border-gray-500 border-opacity-50 flex flex-col">
      <p className="text-muted-foreground self-end mt-2 mx-2 text-sm">
        {replies.length} replies
      </p>
      <div className="">
        {replies.map((reply, index) => {
          return <CommentReplyItem reply={reply} key={index} />;
        })}
      </div>
    </div>
  );
};

interface CommentReplyProps {
  reply: Comment;
}

const CommentReplyItem = ({ reply }: CommentReplyProps) => {
  return (
    <div className="flex flex-col px-4 relative  ">
      <div className="flex gap-2 items-center text-sm text-gray-600">
        {/* Profile and User Info */}
        <Avatar className="">
          <AvatarImage
            className="rounded-full h-10"
            src={reply.createdBy.attachment}
          />
        </Avatar>
        <p>{reply.createdBy.name}</p>
        <p>{new Date(reply.createdAt).toDateString()}</p>

        {/* Vertical Line */}
      </div>

      <div className="h-full pl-12 p-2 flex-1 relative ">
        <p dangerouslySetInnerHTML={{ __html: reply?.content }} />
        <div className="absolute top-0 left-5 w-0.5 h-full bg-gray-500 bg-opacity-50"></div>
      </div>
    </div>
  );
};
