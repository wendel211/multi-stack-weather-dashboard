import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Loading } from "../components/ui/loading";
import { useToast } from "../components/ui/toast";

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
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { showToast } = useToast();

  // PARA MODAIS
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function loadUsers() {
    setInitialLoad(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => showToast("Erro ao carregar usuários", "error"))
      .finally(() => setInitialLoad(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (initialLoad) return <Loading />;

  // CRIAR
  async function handleCreate(e: any) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/users", form);

      showToast("Usuário criado!", "success");
      setIsCreateOpen(false);

      setForm({ name: "", email: "", password: "", role: "user" });

      loadUsers();
    } catch {
      showToast("Erro ao criar usuário", "error");
    } finally {
      setLoading(false);
    }
  }

  // EDITAR
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

  async function handleEdit(e: any) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.patch(`/users/${selectedUser._id}`, {
        name: form.name,
        email: form.email,
        role: form.role,
      });

      showToast("Usuário atualizado!", "success");

      setIsEditOpen(false);
      setSelectedUser(null);

      loadUsers();
    } catch {
      showToast("Erro ao atualizar usuário", "error");
    } finally {
      setLoading(false);
    }
  }

  // EXCLUIR
  async function deleteUser(id: string) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await api.delete(`/users/${id}`);
      showToast("Usuário excluído!", "success");

      loadUsers();
    } catch {
      showToast("Erro ao excluir usuário", "error");
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Usuários</h1>

        {/* CREATE MODAL */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>Novo Usuário</Button>
          </DialogTrigger>

          <DialogContent onClose={() => setIsCreateOpen(false)}>
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Criar"}
                </Button>
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
                className="border-red-500 text-red-600"
              >
                Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClose={() => setIsEditOpen(false)}>
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
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
