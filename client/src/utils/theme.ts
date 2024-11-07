export function setDarkMode(isDark: boolean) {
  const classList = document.documentElement.classList;
  classList.remove("dark");

  if (isDark) {
    classList.add("dark");
  }

  document.documentElement.setAttribute(
    "data-color-scheme",
    isDark ? "dark" : "light",
  );
  document.documentElement
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isDark ? "#151216" : "#ebdfe9");

  localStorage.setItem("dark", isDark ? "1" : "0");
}
