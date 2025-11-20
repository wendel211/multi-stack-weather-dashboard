import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Compass,
} from "lucide-react";

export function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Usuários", icon: Users, path: "/users" },
    { label: "Explorar API", icon: Compass, path: "/explore" },
  ];

  return (
    <aside className="w-56 h-full border-r bg-white shadow-sm">
      <div className="p-4 font-bold text-lg">GDASH Panel</div>

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
                 transition-colors cursor-pointer
                 ${isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"}`
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
