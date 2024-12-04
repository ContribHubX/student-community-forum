import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { GroupTimerState } from "@/types";
import { useEffect, useState } from "react";


interface TimerProp {
  roomId: string;
}

export const Timer = ({ roomId }: TimerProp) => {
  const { socketState } = useSocketProvider();
  const [timer, setTimer] = useState<GroupTimerState>({} as GroupTimerState);

  useEffect(() => {
    if (!roomId || !socketState || !socketState.rooms || !socketState.rooms[roomId]) {
      return;
    }

    const time = socketState.rooms[roomId].timer;
    setTimer({...time})
  }, [roomId, socketState])

  return (
    <div className="text-sm rounded-2xl bg-primary md:max-w-[261px] shadow-xl   flex flex-col">
      <div className="bg-[#bd8322] p-3 text-accent-foreground rounded-t-2xl ">
        <Select>
          <SelectTrigger className=" max-w-[120px] p-0 flex text-[.8rem] font-medium bg-transparent border-0 px-0 h-4">
            <SelectValue placeholder="Group Timer" />
          </SelectTrigger>
          <SelectContent className="text-sm border-0 text-[.8rem]">
            <SelectItem value="personal">Personal Timer</SelectItem>
            <SelectItem value="group">Group Timer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-5xl self-center flex items-center justify-center font-medium py-3 px-6  text-accent-foreground flex-1">
        <span>{timer?.formattedTime || "00:00"}</span>
      </p>
      <div className="p-3 flex flex-col gap-2 items-center pt-0">
        <div className="h-[1px] bg-muted-foreground w-full " />
        <div className="flex items-center gap-3 mt-1">
          <TimerButton isActive={true}>
            <span>👩‍💻</span>
            <span>Focus time</span>
          </TimerButton>
          <TimerButton isActive={false}>
            <span>😎</span>
            <span>Break time</span>
          </TimerButton>
        </div>
      </div>
    </div>
  );
};

interface TimerButtonProp {
  children: React.ReactNode;
  [key: string]: any;
  isActive: boolean;
}

const TimerButton = ({ isActive, children, ...props }: TimerButtonProp) => {
  return (
    <div
      className={`cursor-pointer flex items-center gap-1 py-1 px-3 rounded-full text-xs text-accent-foreground  ${isActive ? "bg-[#24c65f]" : "bg-gray-400"}`}
      {...props}
    >
      {children}
    </div>
  );
};
