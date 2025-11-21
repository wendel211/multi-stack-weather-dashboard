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
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { showToast } = useToast();

  // MODAIS
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // FILTROS
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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
      .then((res) => {
        setUsers(res.data);
        setFiltered(res.data);
      })
      .catch(() => showToast("Erro ao carregar usuários", "error"))
      .finally(() => setInitialLoad(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // APLICAR FILTROS
  useEffect(() => {
    let list = [...users];

    if (search) {
      list = list.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    setFiltered(list);
  }, [search, roleFilter, users]);

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
      
      {/* HEADER & AÇÕES */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <h1 className="text-3xl font-semibold">Gerenciamento de Usuários</h1>

        <div className="flex gap-3">

          <Input
            placeholder="Buscar por nome ou email..."
            className="w-60 dark:bg-gray-900 dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-900 dark:border-gray-700"
          >
            <option value="all">Todos os perfis</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuários comuns</option>
          </select>

          {/* CREATE MODAL */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md">Novo Usuário</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* TABELA */}
      <div className="rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm overflow-hidden">
        
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          {filtered.map((u) => (
            <TableRow
              key={u._id}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
            >
              <TableCell className="capitalize">{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>

              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
                  className="hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Editar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => deleteUser(u._id)}
                  className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Excluir
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </Table>
      </div>


      {/* MODAL DE CRIAÇÃO */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md dark:bg-gray-900 dark:text-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle><span className="text-xl">Criar Usuário</span></DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 mt-2">

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
              className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

            <DialogFooter>
              <Button className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* MODAL DE EDIÇÃO */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md dark:bg-gray-900 dark:text-gray-200 shadow-lg">
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
              className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>

            <DialogFooter>
              <Button className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
