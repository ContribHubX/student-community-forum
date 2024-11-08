import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { toggleMode } = useTheme();

  return (
    <Button
      onClick={toggleMode}
      className="border px-2 cursor-pointer bg-accent flex items-center text-accent-foreground"
    >
      Click
    </Button>
  );
};
