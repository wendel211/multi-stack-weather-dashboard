import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Loading } from "../components/ui/loading";
import { useToast } from "../components/ui/toast";
import { 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  ThermometerSun, 
  Wind,
  Droplets,
  CloudSun
} from "lucide-react";

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

// Componente auxiliar para Itens de Lista com Ícone
const InsightItem = ({ icon: Icon, text, colorClass }: any) => (
  <li className={`flex items-start gap-2 text-sm ${colorClass}`}>
    <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
    <span>{text}</span>
  </li>
);

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingInsights, setRefreshingInsights] = useState(false);

  const { showToast } = useToast();

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

  async function refreshInsights() {
    try {
      setRefreshingInsights(true);
      const response = await api.post("/weather/insights/refresh");
      setInsights(response.data);
      showToast("Insights atualizados com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao atualizar insights", "error");
    } finally {
      setRefreshingInsights(false);
    }
  }

  function applyFilters() {
    let list = [...logs];
    if (startDate) list = list.filter((l) => new Date(l.timestamp) >= new Date(startDate));
    if (endDate) list = list.filter((l) => new Date(l.timestamp) <= new Date(endDate + " 23:59:59"));
    if (condition !== "all") list = list.filter((l) => l.condition === condition);
    list = list.filter((l) => l.temperature >= tempMin && l.temperature <= tempMax);

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

  // Funções de Download (Mantidas a lógica original)
  async function downloadCSV() { /* ... sua lógica original ... */ }
  async function downloadXLSX() { /* ... sua lógica original ... */ }

  if (loading) return <Loading />;

  const latest = filteredLogs[0];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard Climático
        </h1>
        <div className="flex gap-2">
            {/* CORREÇÃO: Removido size="sm", adicionado h-8 e text-xs via className */}
            <Button variant="outline" className="h-8 px-3 text-xs" onClick={downloadCSV}>CSV</Button>
            <Button variant="outline" className="h-8 px-3 text-xs" onClick={downloadXLSX}>XLSX</Button>
        </div>
      </div>

      {/* 🤖 ESTRUTURA DE INSIGHTS */}
      {insights && (
        <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <CloudSun size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Insights Inteligentes
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {insights.cached && <span>Atualizado há {insights.cache_age_minutes || 0} min</span>}
                    {insights.fallback && <span className="text-amber-500">• Modo Fallback</span>}
                  </div>
                </div>
              </div>

              {/* CORREÇÃO: Trocado variant="ghost" por "outline" + border-0 */}
              <Button
                onClick={refreshInsights}
                disabled={refreshingInsights}
                variant="outline" 
                className="h-8 border-0 bg-transparent px-3 text-xs text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                <RefreshCw 
                  size={16} 
                  className={`mr-2 ${refreshingInsights ? "animate-spin" : ""}`} 
                />
                {refreshingInsights ? "Analisando..." : "Atualizar IA"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-7">
              {insights.classificacao && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status Geral:</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {insights.classificacao}
                  </span>
                </div>
              )}
              
              {insights.resumo && (
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Info size={16} /> Resumo da Análise
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {insights.resumo}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5 lg:border-l lg:pl-6 dark:border-slate-800">
              {insights.tendencias?.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Tendências
                  </h3>
                  <ul className="space-y-2">
                    {insights.tendencias.map((t: string, idx: number) => (
                      <InsightItem 
                        key={idx} 
                        icon={TrendingUp} 
                        text={t} 
                        colorClass="text-slate-700 dark:text-slate-300"
                      />
                    ))}
                  </ul>
                </div>
              )}

              {insights.alertas?.length > 0 && insights.tendencias?.length > 0 && (
                 <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-800" />
              )}

              {insights.alertas?.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-red-500/80">
                    Atenção Necessária
                  </h3>
                  <ul className="space-y-2">
                    {insights.alertas.map((a: string, idx: number) => (
                      <InsightItem 
                        key={idx} 
                        icon={AlertTriangle} 
                        text={a} 
                        colorClass="text-red-600 dark:text-red-400 font-medium"
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Temperatura</CardTitle>
            <ThermometerSun className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{latest?.temperature ?? "--"}°C</div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Umidade</CardTitle>
            <Droplets className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{latest?.humidity ?? "--"}%</div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Vento</CardTitle>
            <Wind className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{latest?.wind_speed ?? "--"} km/h</div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Condição</CardTitle>
            <CloudSun className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium text-slate-900 dark:text-white">{latest?.condition ?? "--"}</div>
          </CardContent>
        </Card>
      </div>

      {/* ÁREA DE FILTROS */}
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Período</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Condição</label>
               <select
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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

            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Temp. (Min-Máx)</label>
                <div className="flex gap-2">
                    <input type="number" className="w-full rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={tempMin} onChange={(e) => setTempMin(Number(e.target.value))} />
                    <input type="number" className="w-full rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={tempMax} onChange={(e) => setTempMax(Number(e.target.value))} />
                </div>
            </div>

            <div className="flex items-end gap-2">
               {/* CORREÇÃO: Botões de filtro manuais */}
               <Button onClick={applyFilters} className="flex-1 h-8 px-3 text-xs">Aplicar</Button>
               <Button variant="outline" onClick={resetFilters} className="h-8 px-3 text-xs">Limpar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GRÁFICO */}
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Histórico de Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredLogs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* TABELA */}
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Registros Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="p-3 font-medium">Data</th>
                  <th className="p-3 font-medium">Temp</th>
                  <th className="p-3 font-medium">Umidade</th>
                  <th className="p-3 font-medium">Vento</th>
                  <th className="p-3 font-medium">Condição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.slice(0, 10).map((log: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:text-slate-300">
                    <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3">{log.temperature}°C</td>
                    <td className="p-3">{log.humidity}%</td>
                    <td className="p-3">{log.wind_speed} km/h</td>
                    <td className="p-3">{log.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLogs.length > 10 && (
             <p className="mt-4 text-center text-xs text-slate-400">Mostrando os últimos 10 registros de {filteredLogs.length}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}