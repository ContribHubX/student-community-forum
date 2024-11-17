import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Comment } from "@/types";
import "react-quill/dist/quill.snow.css";

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

          <p className="">{comment.content}</p>
        </div>

        {/* <p className="self-end text-sm font-light text-gray-500">
          {comment.replies.length} replies
        </p> */}
      </div>

      {/* <CommentReplyList replies={comment?.replies} />

      <form
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
