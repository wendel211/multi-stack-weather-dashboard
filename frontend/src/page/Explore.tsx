import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

// Mapa de cores por tipo do Pokémon
const TYPE_COLORS: Record<string, string> = {
  grass: "#66bb6a",
  fire: "#ef5350",
  water: "#42a5f5",
  electric: "#fdd835",
  bug: "#8bc34a",
  normal: "#bdbdbd",
  poison: "#ab47bc",
  ground: "#a1887f",
  fairy: "#f48fb1",
  fighting: "#ff7043",
  psychic: "#ba68c8",
  rock: "#8d6e63",
  ice: "#4dd0e1",
  ghost: "#7e57c2",
  dragon: "#5c6bc0",
  dark: "#616161",
  steel: "#90a4ae",
  flying: "#81d4fa",
};

interface PokemonListResponse {
  results: { name: string; url: string }[];
  next: string | null;
  previous: string | null;
}

export default function Explore() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  async function loadPokemons(url: string) {
    setLoading(true);

    const res = await fetch(url);
    const data: PokemonListResponse = await res.json();

    setNextUrl(data.next);
    setPrevUrl(data.previous);

    const detailed = await Promise.all(
      data.results.map(async (p) => {
        const resp = await fetch(p.url);
        return resp.json();
      })
    );

    setPokemons(detailed);
    setLoading(false);
  }

  useEffect(() => {
    loadPokemons("https://pokeapi.co/api/v2/pokemon?limit=12");
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg animate-pulse">Carregando Pokémons...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Explorar Pokémons</h1>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pokemons.map((p) => {
          const primaryType = p.types[0].type.name;
          const color = TYPE_COLORS[primaryType] ?? "#90caf9";

          return (
            <Card
              key={p.id}
              className="cursor-pointer transition transform hover:scale-[1.03] hover:shadow-xl border-0"
              style={{ background: color + "22" }}
              onClick={() => setSelected(p)}
            >
              <CardHeader>
                <CardTitle className="capitalize text-lg font-bold flex items-center justify-between">
                  {p.name}
                  <span
                    className="px-2 py-1 text-xs rounded-full text-white"
                    style={{ background: color }}
                  >
                    {primaryType}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center">
                <img
                  src={p.sprites.other["official-artwork"].front_default}
                  alt={p.name}
                  className="w-32 h-32 drop-shadow-md"
                />

                <p className="text-sm text-gray-700 mt-3">
                  Tipos: {p.types.map((t: any) => t.type.name).join(", ")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-center gap-4 mt-6">
        {prevUrl && (
          <Button variant="outline" onClick={() => loadPokemons(prevUrl!)}>
            Anterior
          </Button>
        )}

        {nextUrl && <Button onClick={() => loadPokemons(nextUrl!)}>Próxima</Button>}
      </div>

      {/* MODAL DETALHES */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-96 p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-4 capitalize text-center">
              {selected.name}
            </h2>

            <img
              src={selected.sprites.other["official-artwork"].front_default}
              className="w-48 h-48 mx-auto drop-shadow-lg"
            />

            <div className="mt-6 space-y-2 text-gray-700">
              <p><strong>Altura:</strong> {selected.height}</p>
              <p><strong>Peso:</strong> {selected.weight}</p>
              <p>
                <strong>Tipos:</strong>{" "}
                {selected.types.map((t: any) => t.type.name).join(", ")}
              </p>
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
