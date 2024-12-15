import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { GroupTimerState } from "@/types";

interface TimerProp {
  roomId: string;
}

export const Timer = ({ roomId }: TimerProp) => {
  const { socketState } = useSocketProvider();
  const [timer, setTimer] = useState<GroupTimerState>({} as GroupTimerState);
  const [isPersonal, setIsPersonal] = useState(false);
  const [personalTimer, setPersonalTimer] = useState({
    focusTime: 25,
    breakTime: 5,
    currentTime: 25,
    formattedTime: "25:00",
    state: "focus",
    started: false,
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeTimerState = (state: string) =>
    isPersonal ? personalTimer.state === state : timer.state === state;

  useEffect(() => {
    if (!roomId || !socketState?.rooms?.[roomId]) return;
    setTimer(socketState.rooms[roomId].timer);
  }, [roomId, socketState]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (personalTimer.started) startPersonalTimer();
  }, [personalTimer.state, personalTimer.started]);

  const startPersonalTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    let remainingTime = personalTimer.currentTime * 60;

    timerIntervalRef.current = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(timerIntervalRef.current!);
        const nextState = personalTimer.state === "focus" ? "break" : "focus";
        const nextTime = nextState === "focus" ? personalTimer.focusTime : personalTimer.breakTime;
        setPersonalTimer((prev) => ({
          ...prev,
          currentTime: nextTime,
          state: nextState,
          formattedTime: `${nextTime.toString().padStart(2, "0")}:00`,
        }));
        return;
      }

      remainingTime -= 1;
      const formattedTime = formatTime(remainingTime);
      setPersonalTimer((prev) => ({ ...prev, formattedTime }));
    }, 1000);
  };

  const handlePersonalTimerSubmit = (focusTime: number, breakTime: number) => {
    setPersonalTimer({
      focusTime,
      breakTime,
      currentTime: focusTime,
      formattedTime: `${focusTime.toString().padStart(2, "0")}:00`,
      state: "focus",
      started: true,
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="text-sm rounded-2xl bg-[#262d34] md:max-w-[261px]  shadow-xl flex flex-col">
      <div className="bg-[#bd8322] p-3 text-accent-foreground rounded-t-2xl">
        <Select
          onValueChange={(value) => setIsPersonal(value === "personal")}
          defaultValue="group"
        >
          <SelectTrigger className="max-w-[120px] p-0 flex text-[.8rem] font-medium bg-transparent border-0 px-0 h-4">
            <SelectValue placeholder="Group Timer" />
          </SelectTrigger>
          <SelectContent className="text-sm border-0 text-[.8rem]">
            <SelectItem value="personal">Personal Timer</SelectItem>
            <SelectItem value="group">Group Timer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2 flex items-center justify-center">
        {isPersonal ? (
          !personalTimer.started ? (
            <PersonalTimerForm
              onSubmit={handlePersonalTimerSubmit}
              focusTime={personalTimer.focusTime}
              breakTime={personalTimer.breakTime}
            />
          ) : (
            <p className="text-5xl self-center flex items-center justify-center font-medium py-3 px-6 text-accent-foreground flex-1">
              <span className="digital-font">{personalTimer?.formattedTime || "00:00"}</span>
            </p>
          )
        ) : (
          <p className="text-5xl self-center flex items-center justify-center font-medium py-3 px-6 text-accent-foreground flex-1">
            <span className="digital-font">{timer?.formattedTime || "00:00"}</span>
          </p>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 items-center pt-3">
        <div className="h-[1px] bg-muted-foreground w-full" />
        <div className="flex items-center gap-3 mt-1">
          <TimerButton isActive={() => activeTimerState("focus")}>
            <span>👩‍💻</span>
            <span>Focus time</span>
          </TimerButton>
          <TimerButton isActive={() => activeTimerState("break")}>
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
  isActive: () => boolean;
}

const TimerButton = ({ isActive, children, ...props }: TimerButtonProp) => {
  const state = isActive();

  return (
    <div
      className={`cursor-pointer flex items-center gap-1 py-1 px-3 rounded-full text-xs text-accent-foreground ${
        state ? "bg-[#24c65f]" : "bg-gray-400"
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

interface PersonalTimerFormProps {
  onSubmit: (focusTime: number, breakTime: number) => void;
  focusTime: number;
  breakTime: number;
}

const PersonalTimerForm = ({
  onSubmit,
  focusTime,
  breakTime,
}: PersonalTimerFormProps) => {
  const [focusInput, setFocusInput] = useState(focusTime);
  const [breakInput, setBreakInput] = useState(breakTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(focusInput, breakInput);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 p-4 text-accent-foreground"
    >
      <div className="flex gap-2">
        <label className="flex flex-col items-center">
          <span className="text-xs mb-1">Focus Time (mins)</span>
          <input
            type="number"
            value={focusInput}
            onChange={(e) => setFocusInput(Number(e.target.value))}
            className="bg-gray-800 text-center rounded-md p-1 w-16"
            min={1}
          />
        </label>
        <label className="flex flex-col items-center">
          <span className="text-xs mb-1">Break Time (mins)</span>
          <input
            type="number"
            value={breakInput}
            onChange={(e) => setBreakInput(Number(e.target.value))}
            className="bg-gray-800 text-center rounded-md p-1 w-16"
            min={1}
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-[#24c65f] px-4 py-2 rounded-md text-xs font-medium"
      >
        Start Timer
      </button>
    </form>
  );
};
