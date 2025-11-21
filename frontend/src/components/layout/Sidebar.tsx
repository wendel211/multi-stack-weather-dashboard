import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Compass } from "lucide-react";

export function Sidebar() {
  const menu = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Usuários", path: "/users", icon: Users },
    { label: "Explorar API", path: "/explore", icon: Compass },
  ];

  return (
    <aside className="w-56 h-full border-r bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      <div className="p-4 font-bold text-lg dark:text-gray-100">
        GDASH Panel
      </div>

      <nav className="flex flex-col gap-1 px-3 mt-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200"
                }`
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
