import { CreateThreadForm } from "./create-thread-form";
import { ThreadCardList } from "./thread-card-list";

interface ThreadsProp {
  userId: string;
}

export const Threads = ({ userId }: ThreadsProp) => {
  return (
    <div>
      <div>
        <CreateThreadForm userId={userId} />
      </div>

      <div>
        <ThreadCardList />
      </div>
    </div>
  );
};
