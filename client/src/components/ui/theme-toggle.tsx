import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { toggleMode } = useTheme();

  return (
    // <Button
    //   onClick={toggleMode}
    //   className="border px-2 cursor-pointer bg-accent flex items-center text-accent-foreground"
    // >
    //   Click
    // </Button>
    <label className="toggle-switch">
      <input type="checkbox" onChange={toggleMode} />
      <div className="toggle-switch-background">
        <div className="toggle-switch-handle"></div>
      </div>
    </label>
  );
};
