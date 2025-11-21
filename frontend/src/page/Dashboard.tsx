import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Loading } from "../components/ui/loading";
import { useToast } from "../components/ui/toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // FILTROS
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [condition, setCondition] = useState("all");
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(60);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const logsRes = await api.get("/weather/logs");
        const insightsRes = await api.get("/weather/insights");

        setLogs(logsRes.data);
        setFilteredLogs(logsRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        showToast("Erro ao carregar dados do dashboard", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function applyFilters() {
    let list = [...logs];

    // FILTRO — INTERVALO DE DATAS
    if (startDate) {
      list = list.filter(
        (l) => new Date(l.timestamp) >= new Date(startDate)
      );
    }
    if (endDate) {
      list = list.filter(
        (l) => new Date(l.timestamp) <= new Date(endDate + " 23:59:59")
      );
    }

    // FILTRO — CONDIÇÃO
    if (condition !== "all") {
      list = list.filter((l) => l.condition === condition);
    }

    // FILTRO — POR TEMPERATURA
    list = list.filter(
      (l) => l.temperature >= tempMin && l.temperature <= tempMax
    );

    setFilteredLogs(list);

    showToast("Filtros aplicados!", "success");
  }

  function resetFilters() {
    setStartDate("");
    setEndDate("");
    setCondition("all");
    setTempMin(0);
    setTempMax(60);
    setFilteredLogs(logs);

    showToast("Filtros limpos.", "success");
  }

  if (loading) return <Loading />;

  const latest = filteredLogs[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Climático</h1>

      {/* FILTROS */}
      <Card className="p-4">
        <CardTitle className="mb-4">Filtros Avançados</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Intervalo de datas */}
          <div>
            <label>Data inicial</label>
            <input
              type="date"
              className="border w-full p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label>Data final</label>
            <input
              type="date"
              className="border w-full p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Condição */}
          <div>
            <label>Condição</label>
            <select
              className="border w-full p-2 rounded"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="Clear">Ensolarado ☀</option>
              <option value="Cloudy">Nublado ☁</option>
              <option value="Rain">Chuva 🌧</option>
              <option value="Wind">Vento 🌬</option>
            </select>
          </div>

          {/* Temperatura */}
          <div>
            <label>Temperatura (min - max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="border w-full p-2 rounded"
                value={tempMin}
                onChange={(e) => setTempMin(Number(e.target.value))}
              />
              <input
                type="number"
                className="border w-full p-2 rounded"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button onClick={applyFilters}>Aplicar</Button>
          <Button variant="outline" onClick={resetFilters}>
            Limpar
          </Button>
        </div>
      </Card>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Temperatura</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {latest?.temperature ?? "--"}°C
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Umidade</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {latest?.humidity ?? "--"}%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vento</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {latest?.wind_speed ?? "--"} km/h
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condição</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-medium">
            {latest?.condition ?? "--"}
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICO */}
      <Card>
        <CardHeader>
          <CardTitle>Temperatura ao longo do tempo</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredLogs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" hide />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* EXPORTAÇÃO */}
      <div className="flex gap-3">
        <Button onClick={() => window.open("/api/weather/export.csv", "_blank")}>
          Exportar CSV
        </Button>

        <Button onClick={() => window.open("/api/weather/export.xlsx", "_blank")}>
          Exportar XLSX
        </Button>
      </div>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Filtrados</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-2">Data</th>
                <th className="p-2">Temp</th>
                <th className="p-2">Umidade</th>
                <th className="p-2">Vento</th>
                <th className="p-2">Condição</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2">{log.temperature}°C</td>
                  <td className="p-2">{log.humidity}%</td>
                  <td className="p-2">{log.wind_speed} km/h</td>
                  <td className="p-2">{log.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* INSIGHTS DE IA */}
      {insights && (
        <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-xl">🔍 Insights Inteligentes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">

            {/* Resumo */}
            {insights.resumo && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Resumo</h3>
                <p>{insights.resumo}</p>
              </div>
            )}

            {/* Tendências */}
            {insights.tendencias?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">Tendências</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {insights.tendencias.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alertas */}
            {insights.alertas?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">
                  ⚠️ Alertas
                </h3>
                <ul className="list-disc ml-6 space-y-1">
                  {insights.alertas.map((a: string, idx: number) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Classificação */}
            {insights.classificacao && (
              <div className="mt-2">
                <h3 className="font-semibold text-lg">Classificação Geral</h3>
                <span className="px-4 py-2 rounded-full text-white bg-blue-600">
                  {insights.classificacao}
                </span>
              </div>
            )}

            {/* Fallback caso venha texto bruto */}
            {!insights.resumo &&
              !insights.alertas &&
              !insights.tendencias &&
              insights.insights && (
                <p>{insights.insights}</p>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
