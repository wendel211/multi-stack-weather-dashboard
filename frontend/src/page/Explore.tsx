import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Search, RotateCcw, X } from "lucide-react"; // Adicionei ícones para melhorar a UX

const TYPE_COLORS: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400 text-yellow-950", // Texto escuro para contraste no amarelo
  rock: "bg-yellow-800",
  ground: "bg-amber-700",
  psychic: "bg-pink-500",
  dark: "bg-slate-800",
  fairy: "bg-pink-300 text-pink-950",
  fighting: "bg-orange-700",
  steel: "bg-slate-400 text-slate-900",
  ice: "bg-cyan-400 text-cyan-950",
  bug: "bg-lime-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  poison: "bg-purple-500",
  flying: "bg-sky-500",
  normal: "bg-slate-400 text-slate-900",
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
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-slate-200 animate-pulse dark:bg-slate-800"
            />
          ))}
        </div>
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
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Explorar Pokémons
      </h1>

      {/* FILTROS */}
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800 dark:text-slate-200">
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                className="w-full rounded border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded border border-slate-200 bg-white p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "Todos os tipos" : t.toUpperCase()}
                </option>
              ))}
            </select>

            <Button 
              onClick={load} 
              variant="outline"
              className="w-full dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Recarregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pokemons.map((p) => {
          const type = p.types[0].type.name;
          // Fallback seguro para cor
          const colorClass = TYPE_COLORS[type] || "bg-slate-500";

          return (
            <Card
              key={p.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:border-slate-800"
              onClick={() => setSelected(p)}
            >
              <CardHeader
                className={`${colorClass} relative flex h-24 items-center justify-center p-0`}
              >
                <span className="absolute right-2 top-2 text-xs font-bold text-white/50">
                  #{String(p.id).padStart(3, "0")}
                </span>
                <CardTitle className="capitalize text-white text-xl drop-shadow-md">
                  {p.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center pb-6 pt-0">
                <div className="-mt-12 mb-3 rounded-full bg-white/20 p-2 backdrop-blur-sm dark:bg-slate-900/20">
                    <img
                    src={p.sprites.other["official-artwork"].front_default}
                    alt={p.name}
                    className="h-28 w-28 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {p.types.map((t: any) => (
                    <span
                      key={t.type.name}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wide dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal com a cor do tipo */}
            <div className={`${TYPE_COLORS[selected.types[0].type.name]} p-6 text-center relative`}>
                <button 
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 rounded-full bg-white/20 p-1 text-white hover:bg-white/40 transition-colors"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-3xl font-bold capitalize text-white drop-shadow-md">
                    {selected.name}
                </h2>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <img
                        src={selected.sprites.other["official-artwork"].front_default}
                        className="h-40 w-40 drop-shadow-2xl"
                    />
                </div>
            </div>

            <div className="mt-12 px-6 pb-6 pt-2">
              <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Altura</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{selected.height / 10} m</p>
                 </div>
                 <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Peso</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{selected.weight / 10} kg</p>
                 </div>
              </div>

              <div className="mt-4 space-y-3">
                 <div>
                    <p className="mb-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Tipos</p>
                    <div className="flex gap-2">
                        {selected.types.map((t: any) => (
                            <span key={t.type.name} className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border dark:border-slate-700">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                 </div>
                 
                 <div>
                    <p className="mb-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Base XP</p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((selected.base_experience / 300) * 100, 100)}%` }}></div>
                    </div>
                    <p className="mt-1 text-xs text-right text-slate-500 dark:text-slate-400">{selected.base_experience} XP</p>
                 </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => setSelected(null)}>
                  Fechar Detalhes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}