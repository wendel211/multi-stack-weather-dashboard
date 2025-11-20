import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    api.get("/weather/logs").then((res) => setData(res.data));
    api.get("/weather/insights").then((res) => setInsights(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard Climático</h1>

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(insights, null, 2)}
      </pre>
    </div>
  );
}
