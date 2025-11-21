import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  rock: "bg-yellow-800",
  ground: "bg-amber-700",
  psychic: "bg-pink-500",
  dark: "bg-gray-800",
  fairy: "bg-pink-300",
  fighting: "bg-orange-700",
  steel: "bg-gray-400",
  ice: "bg-cyan-400",
  bug: "bg-lime-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  poison: "bg-purple-500",
  flying: "bg-sky-500",
  normal: "bg-gray-300",
};

export default function Explore() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [originalList, setOriginalList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // filtros
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  async function load() {
    setLoading(true);

    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await res.json();

    const detailed = await Promise.all(
      data.results.map(async (p: any) => {
        const resp = await fetch(p.url);
        return resp.json();
      })
    );

    setPokemons(detailed);
    setOriginalList(detailed);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // FILTRO DE BUSCA
  useEffect(() => {
    let list = [...originalList];

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      list = list.filter((p) =>
        p.types.some((t: any) => t.type.name === typeFilter)
      );
    }

    setPokemons(list);
  }, [search, typeFilter]);

  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );

  const types = [
    "all",
    "fire",
    "water",
    "grass",
    "electric",
    "rock",
    "ground",
    "psychic",
    "dark",
    "fairy",
    "fighting",
    "steel",
    "ice",
    "bug",
    "ghost",
    "dragon",
    "poison",
    "flying",
    "normal",
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-semibold">Explorar Pokémons</h1>

      {/* FILTROS */}
      <Card className="p-4">
        <CardTitle className="mb-3">Filtros</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Buscar Pokémon..."
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "Todos os tipos" : t.toUpperCase()}
              </option>
            ))}
          </select>

          <Button onClick={load}>Recarregar</Button>
        </div>
      </Card>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pokemons.map((p) => {
          const type = p.types[0].type.name;
          const color = TYPE_COLORS[type] ?? "bg-gray-200";

          return (
            <Card
              key={p.id}
              className="cursor-pointer shadow hover:shadow-lg transition hover:-translate-y-1"
              onClick={() => setSelected(p)}
            >
              <CardHeader
                className={`${color} text-white rounded-t-lg p-3`}
              >
                <CardTitle className="capitalize text-lg">
                  {p.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center py-4">
                <img
                  src={p.sprites.other["official-artwork"].front_default}
                  className="w-24 h-24 drop-shadow"
                />

                <div className="mt-3 flex gap-2">
                  {p.types.map((t: any) => (
                    <span
                      key={t.type.name}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 border"
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-96 animate-fade"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold capitalize text-center mb-3">
              {selected.name}
            </h2>

            <img
              src={selected.sprites.other["official-artwork"].front_default}
              className="w-40 h-40 mx-auto"
            />

            <div className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
              <p><strong>Altura:</strong> {selected.height}</p>
              <p><strong>Peso:</strong> {selected.weight}</p>
              <p><strong>Tipos:</strong> {selected.types.map((t: any) => t.type.name).join(", ")}</p>
              <p><strong>Base XP:</strong> {selected.base_experience}</p>
            </div>

            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
