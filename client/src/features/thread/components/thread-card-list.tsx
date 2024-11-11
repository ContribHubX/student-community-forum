import { ThreadCard } from "./thread-card";

export const ThreadCardList = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {"123456".split("").map((el) => (
        <ThreadCard key={el} />
      ))}
    </div>
  );
};
