import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types"
import { useNavigate } from "react-router-dom"

interface ThreadActionFormProp {
    user: User
}

export const ThreadActionForm = ({ user }: ThreadActionFormProp) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex p-6 gap-6 rounded-xl bg-primary relative mb-6 shadow-slate-400 shadow-md dark:shadow-gray-900">
        <div className="w-full flex gap-4 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.attachment}
              className="rounded-full "
            />
          </Avatar>
          <input
            readOnly
            className="h-full text-sm w-full font-light px-5 bg-background text-primary-foreground rounded-md
            outline-none focus:border-red-600"
            placeholder="Lets share what's going on your mind.."
            onClick={() => navigate("/thread-action/create")}
          />
        </div>
        <button
          onClick={() => navigate("/thread-action/create")}
          type="submit"
          className="shrink-0 bg-accent text-accent-foreground py-3 px-4 text-sm rounded-md "
        >
          Create Thread
        </button>
    </div>
  )
}
