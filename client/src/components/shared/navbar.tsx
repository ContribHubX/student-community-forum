import { ThemeToggle } from "../ui/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="bg-primary px-3 py-2 flex">
      <div>{/* logo here */}</div>

      <div className="flex gap-2">
        <ThemeToggle />
        <div className="h-10 w-10 rounded-full bg-red-600">{/* Profile */}</div>
      </div>
    </nav>
  );
};
