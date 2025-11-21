import { LogOut, Moon, Sun } from "lucide-react";
import { getCurrentUser, logout } from "../../store/auth";
import { useTheme } from "../../context/theme";

export function Header() {
  const user = getCurrentUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-white dark:bg-gray-900 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold dark:text-gray-100">
        Bem-vindo, {user?.email ?? "Usuário"}
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:opacity-80 transition"
        >
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} className="text-yellow-400" />
          )}
        </button>

        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 dark:text-gray-200"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  );
}
