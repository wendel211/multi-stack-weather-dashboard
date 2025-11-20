export interface ClimateStats {
  avgTemperature: number;
  avgHumidity: number;
  avgWind: number;

  minTemperature: number;
  maxTemperature: number;

  trendTemperature: 'up' | 'down' | 'stable';
}

export interface InsightResponse {
  stats: ClimateStats;
  message: string;
}
