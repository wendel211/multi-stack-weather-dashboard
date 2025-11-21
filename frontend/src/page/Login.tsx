import { useState } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../context/theme";
import { Moon, Sun } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@gdash.com");
  const [password, setPassword] = useState("123456");
  const { theme, toggleTheme } = useTheme();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.access_token);
    window.location.href = "/";
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all">

      {/* Botão de tema */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105 transition"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <form
        onSubmit={handleLogin}
        className="
          w-80 p-6 rounded-xl shadow-lg backdrop-blur
          bg-white/80 dark:bg-gray-800/60
          border border-gray-200 dark:border-gray-700
          transition
        "
      >
        <h1 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-100 text-center">
          Bem-vindo ao GDASH
        </h1>

        <div className="space-y-3">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          <Input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <Button className="w-full mt-5 py-2 text-lg" type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}
