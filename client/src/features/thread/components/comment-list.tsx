import { useGetThreadComments } from "@/features/thread/api/get-thread-comments";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { CommentForm } from "@/features/thread/components/comment-form";

interface CommentListProps {
  threadId: string | undefined;
}

export const CommentList = ({ threadId }: CommentListProps) => {
  const { data: comments, isFetching } = useGetThreadComments({
    threadId: threadId,
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 space-y-3 text-primary-foreground">
      <div className="flex items-center justify-between">
        <h1>{comments?.length} comments</h1>
        <div className="space-x-2 ">
          <Button className="font-light text-sm text-accent-foreground ">
            Popular
          </Button>
          <Button className="font-light text-sm bg-primary shadow-md">
            Newest
          </Button>
          <Button className="font-light text-sm bg-primary shadow-md">
            Oldest
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {comments?.map((comment, index) => {
          return <CommentItem key={index} comment={comment} />;
        })}
      </div>

      <CommentForm
        threadId={threadId}
        placeholder="Write your comment here"
        isComment
      />
    </div>
  );
};
