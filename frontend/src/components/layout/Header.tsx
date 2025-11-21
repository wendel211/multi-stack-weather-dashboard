// Header.tsx
import { LogOut } from "lucide-react";
import { getCurrentUser, logout } from "../../store/auth";

export function Header() {
  const user = getCurrentUser();

  return (
    <header className="
      h-16 bg-white/80 backdrop-blur-md border-b flex items-center 
      justify-between px-6 shadow-sm sticky top-0 z-40
    ">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Bem-vindo, <span className="text-blue-600">{user?.email ?? "Usuário"}</span>
        </h1>
      </div>

      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md 
        hover:bg-red-50 hover:text-red-600 transition"
      >
        <LogOut size={16} />
        Sair
      </button>
    </header>
  );
}
