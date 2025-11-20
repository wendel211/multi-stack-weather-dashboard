import { LogOut } from "lucide-react";
import { logout, getCurrentUser } from "../../store/auth";

export function Header() {
  const user = getCurrentUser();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold">
        Bem-vindo, {user?.email ?? "Usuário"}
      </h1>

      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="flex items-center gap-2 hover:text-red-600"
      >
        <LogOut size={16} />
        Sair
      </button>
    </header>
  );
}
