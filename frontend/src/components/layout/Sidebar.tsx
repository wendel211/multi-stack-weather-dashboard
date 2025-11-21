// Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Compass } from "lucide-react";

export function Sidebar() {
  const menu = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Usuários", path: "/users", icon: Users },
    { label: "Explorar API", path: "/explore", icon: Compass },
  ];

  return (
    <aside className="
      w-60 h-full border-r bg-white/80 backdrop-blur-xl shadow-lg
      flex flex-col
    ">
      <div className="p-5 font-bold text-xl tracking-tight text-blue-600">
        GDASH Panel
      </div>

      <nav className="flex flex-col gap-1 px-4 mt-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm font-semibold"
                    : "hover:bg-gray-100"
                  }
                `
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
