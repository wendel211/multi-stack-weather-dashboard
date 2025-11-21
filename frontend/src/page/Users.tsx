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

  // MODAIS
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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Usuários</h1>

        {/* CREATE */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md">Novo Usuário</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle><span className="text-xl font-bold">Criar Usuário</span></DialogTitle>
              <DialogDescription>
                <p className="text-sm">
                  Preencha os dados abaixo para registrar um novo usuário.
                </p>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-2">

              <Input
                name="name"
                placeholder="Nome"
                value={form.name}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />

              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />

              <Input
                name="password"
                placeholder="Senha"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>

              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Salvando..." : "Criar Usuário"}
                </Button>
              </DialogFooter>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABELA */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          {users.map((u) => (
            <TableRow
              key={u._id}
              className="hover:bg-blue-50/40 transition-colors"
            >
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {u.role}
                </span>
              </TableCell>

              <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>

              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => openEditModal(u)}
                  className="hover:border-blue-500 hover:text-blue-600"
                >
                  Editar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => deleteUser(u._id)}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  Excluir
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </Table>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle><span className="text-xl">Editar Usuário</span></DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">

            <Input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
