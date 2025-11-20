import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

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

    // Carregar detalhes individuais
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
    return <p className="text-center mt-10 text-lg">Carregando Pokémons...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Explorar Pokémons</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pokemons.map((p) => (
          <Card
            key={p.id}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => setSelected(p)}
          >
            <CardHeader>
              <CardTitle className="capitalize">{p.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center">
              <img
                src={p.sprites.front_default}
                alt={p.name}
                className="w-24 h-24"
              />

              <p className="text-sm text-gray-600 mt-2">
                Tipo: {p.types.map((t: any) => t.type.name).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center gap-4 mt-6">
        {prevUrl && (
          <Button variant="outline" onClick={() => loadPokemons(prevUrl!)}>
            Anterior
          </Button>
        )}

        {nextUrl && (
          <Button onClick={() => loadPokemons(nextUrl!)}>
            Próxima
          </Button>
        )}
      </div>

      {/* Detalhe do Pokémon */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
             onClick={() => setSelected(null)}>
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 capitalize text-center">
              {selected.name}
            </h2>

            <img
              src={selected.sprites.other["official-artwork"].front_default}
              className="w-40 h-40 mx-auto"
            />

            <p className="mt-4 text-gray-700">
              <strong>Altura:</strong> {selected.height}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Peso:</strong> {selected.weight}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Tipos:</strong>{" "}
              {selected.types.map((t: any) => t.type.name).join(", ")}
            </p>

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
