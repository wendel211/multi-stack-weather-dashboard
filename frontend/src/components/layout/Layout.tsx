// Layout.tsx
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ children }: any) {
  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 animate-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
