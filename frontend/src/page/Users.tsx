import { useEffect, useState } from "react";
import { api } from "../api/axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  function loadUsers() {
    api.get("/users").then((res) => {
      setUsers(res.data);
    });
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate(e: any) {
    e.preventDefault();

    await api.post("/users", form);

    setIsCreateOpen(false);
    setForm({ name: "", email: "", password: "", role: "user" });
    loadUsers();
  }

  async function handleEdit(e: any) {
    e.preventDefault();

    await api.patch(`/users/${selectedUser._id}`, {
      name: form.name,
      email: form.email,
      role: form.role,
    });

    setIsEditOpen(false);
    setSelectedUser(null);
    loadUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    await api.delete(`/users/${id}`);
    loadUsers();
  }

  function openEditModal(user: any) {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });

    setIsEditOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Usuários</h1>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Novo Usuário</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações para registrar um novo usuário.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                name="name"
                placeholder="Nome"
                value={form.name}
                onChange={handleChange}
                required
              />

              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                name="password"
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>

              <DialogFooter>
                <Button type="submit">Criar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABELA */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        {users.map((u) => (
          <TableRow key={u._id}>
            <TableCell>{u.name}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell>
              {new Date(u.createdAt).toLocaleString()}
            </TableCell>

            <TableCell className="flex gap-2">
              <Button variant="outline" onClick={() => openEditModal(u)}>
                Editar
              </Button>

              <Button
                variant="outline"
                onClick={() => deleteUser(u._id)}
                className="border-red-400 text-red-600"
              >
                Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <Input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
