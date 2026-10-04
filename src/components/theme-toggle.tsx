import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  return (
    <button type="button" onClick={toggleTheme} className="bg-indigo-500 hover:bg-indigo-300 border rounded-xl cursor-pointer p-2">
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </button>
  )
}

export default ThemeToggle

