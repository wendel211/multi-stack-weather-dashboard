import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex flex-col flex-1">
        <Header />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
