import { useEffect, useState } from "react";
import { api } from "../api/axios";

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
  const [logs, setLogs] = useState([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    api.get("/weather/logs").then((res) => setLogs(res.data));
    api.get("/weather/insights").then((res) => setInsights(res.data));
  }, []);

  const latest = logs[0];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">Dashboard Climático</h1>

      {/* 1️⃣ CARDS PRINCIPAIS */}
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

      {/* 2️⃣ GRÁFICO */}
      <Card>
        <CardHeader>
          <CardTitle>Temperatura ao longo do tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3️⃣ EXPORTAÇÕES */}
      <div className="flex gap-3">
        <Button onClick={() => window.open("/api/weather/export.csv", "_blank")}>
          Exportar CSV
        </Button>

        <Button onClick={() => window.open("/api/weather/export.xlsx", "_blank")}>
          Exportar XLSX
        </Button>
      </div>

      {/* 4️⃣ TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Clima</CardTitle>
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
              {logs.map((log: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
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

      {/* 5️⃣ INSIGHTS IA */}
      {insights && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>🔍 Insights de IA</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {insights.message}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
