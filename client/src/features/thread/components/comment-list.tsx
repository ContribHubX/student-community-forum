import { useGetThreadComments } from "@/features/thread/api/get-thread-comments";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  threadId: string | undefined;
}

export const CommentList = ({ threadId }: CommentListProps) => {
  const { data: comments } = useGetThreadComments(threadId, {});

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
    </div>
  );
};
