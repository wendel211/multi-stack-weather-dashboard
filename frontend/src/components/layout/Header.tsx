import { LogOut } from "lucide-react";
import { getCurrentUser, logout } from "../../store/auth";

export function Header() {
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <header className="h-14 w-full border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <h1 className="font-semibold">Bem-vindo, {user?.email}</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
      >
        <LogOut size={16} />
        Sair
      </button>
    </header>
  );
}
