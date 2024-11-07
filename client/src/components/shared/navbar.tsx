import { ThemeToggle } from "../ui/theme-toggle";

export const Navbar = () => {
  return (
    <nav className="bg-primary px-3 py-2">
      <div>{/* logo here */}</div>

      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
