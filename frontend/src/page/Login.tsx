import { useState } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("admin@gdash.com");
  const [password, setPassword] = useState("123456");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.access_token);
    window.location.href = "/";
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form className="p-6 rounded-lg bg-white shadow-sm w-80" onSubmit={handleLogin}>
        <h1 className="text-xl mb-4 font-semibold">Login</h1>

        <Input 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="mt-3"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full mt-4" type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}
