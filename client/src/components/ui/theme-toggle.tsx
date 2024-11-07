import { useTheme } from "../../providers/theme";

export const ThemeToggle = () => {
  const { toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="border px-2 cursor-pointer  rounded-full bg-secondary flex items-center"
    >
      Click
    </button>
  );
};
