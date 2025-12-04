import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';

import axios from 'axios';
import { Parser } from 'json2csv';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>,
  ) {}

  // ---------------------------
  // CRUD & LISTAGEM NORMAL
  // ---------------------------
  async create(dto: CreateWeatherDto) {
    return this.weatherModel.create(dto);
  }

  async findAll(query: QueryWeatherDto) {
    const filter: any = {};

    if (query.start || query.end) {
      filter.timestamp = {};

      if (query.start) filter.timestamp.$gte = new Date(query.start);
      if (query.end) filter.timestamp.$lte = new Date(query.end);
    }

    return this.weatherModel.find(filter).sort({ timestamp: -1 }).exec();
  }

  // ---------------------------
  // EXPORTAÇÕES
  // ---------------------------
  async exportCSV() {
    const logs = await this.weatherModel.find().lean().exec();
    const parser = new Parser();
    return parser.parse(logs);
  }

  async exportXLSX() {
    const logs = await this.weatherModel.find().lean().exec();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather Logs');

    sheet.columns = [
      { header: 'Temperature', key: 'temperature', width: 15 },
      { header: 'Humidity', key: 'humidity', width: 15 },
      { header: 'Wind Speed', key: 'wind_speed', width: 15 },
      { header: 'Condition', key: 'condition', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];

    logs.forEach((log) => sheet.addRow(log));

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  // ---------------------------
  // 🚀 INTEGRAÇÃO COM IA-SERVICE (CORRIGIDO)
  // ---------------------------
  async generateInsights() {
    try {
      const AI_URL = process.env.AI_URL ?? 'http://ai-service:8001';

      console.log('🤖 Chamando AI Service para gerar insights...');
      console.log(`📡 URL: ${AI_URL}/generate-insights`);

      // ✅ CHAMA O ENDPOINT CORRETO
      // O AI Service vai buscar os dados diretamente da API
      const response = await axios.post(
        `${AI_URL}/generate-insights`,
        {}, // Corpo vazio - o AI Service busca os dados
        {
          timeout: 30000, // 30 segundos
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Insights recebidos com sucesso!');

      return {
        success: true,
        ...response.data,
      };
    } catch (error: any) {
      console.error('❌ Erro ao chamar IA-Service:', error.message);

      if (error.response) {
        console.error('Resposta do erro:', error.response.data);
      }

      // ✅ FALLBACK INTELIGENTE
      // Se a IA falhar, gera insights baseados em regras
      return this.generateFallbackInsights();
    }
  }

  /**
   * Gera insights baseados em regras simples (fallback)
   * Usado quando a IA não está disponível
   */
  private async generateFallbackInsights() {
    try {
      const logs = await this.weatherModel
        .find()
        .sort({ timestamp: -1 })
        .limit(20)
        .exec();

      if (logs.length === 0) {
        return {
          success: false,
          fallback: true,
          message: 'Não há dados climáticos suficientes para análise.',
          resumo: 'Aguardando coleta de dados...',
          tendencias: [],
          alertas: [],
          classificacao: 'Sem dados',
        };
      }

      // Calcular estatísticas
      const temps = logs.map((l) => l.temperature);
      const hums = logs.map((l) => l.humidity);
      const winds = logs.map((l) => l.wind_speed);

      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const avgHum = hums.reduce((a, b) => a + b, 0) / hums.length;
      const avgWind = winds.reduce((a, b) => a + b, 0) / winds.length;

      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);

      // Detectar tendência
      const firstTemp = temps[temps.length - 1];
      const lastTemp = temps[0];
      const trend =
        lastTemp > firstTemp + 2
          ? 'aquecimento'
          : lastTemp < firstTemp - 2
          ? 'resfriamento'
          : 'estável';

      // Gerar insights
      const tendencias: string[] = [];
      const alertas: string[] = [];

      // Tendências
      tendencias.push(
        `Temperatura ${trend} (${firstTemp.toFixed(1)}°C → ${lastTemp.toFixed(1)}°C)`,
      );

      if (avgWind > 20) {
        tendencias.push('Ventos intensos observados');
      } else if (avgWind < 5) {
        tendencias.push('Período de calmaria');
      }

      if (avgHum > 80) {
        tendencias.push('Alta umidade relativa do ar');
      } else if (avgHum < 40) {
        tendencias.push('Ar seco persistente');
      }

      // Alertas
      if (maxTemp > 35) {
        alertas.push('⚠️ Calor extremo - evite exposição prolongada ao sol');
      }

      if (minTemp < 10) {
        alertas.push('❄️ Temperaturas baixas - agasalhe-se adequadamente');
      }

      if (avgWind > 30) {
        alertas.push('🌬️ Ventos fortes - cuidado com objetos soltos');
      }

      if (avgHum > 85) {
        alertas.push('💧 Umidade muito alta - possibilidade de chuva');
      }

      // Classificação
      let classificacao = 'Agradável';

      if (avgTemp > 30) classificacao = 'Quente';
      else if (avgTemp < 15) classificacao = 'Frio';
      else if (avgWind > 25) classificacao = 'Ventoso';
      else if (maxTemp - minTemp > 10) classificacao = 'Instável';

      const resumo = `Temperatura média de ${avgTemp.toFixed(1)}°C com umidade de ${avgHum.toFixed(1)}%. Observa-se ${trend} nas últimas horas. Condições climáticas ${classificacao.toLowerCase()}.`;

      return {
        success: true,
        fallback: true,
        message:
          'Insights gerados por análise de regras (IA não disponível no momento)',
        resumo,
        tendencias,
        alertas,
        classificacao,
        metadata: {
          registros_analisados: logs.length,
          temperatura_media: parseFloat(avgTemp.toFixed(1)),
          umidade_media: parseFloat(avgHum.toFixed(1)),
        },
      };
    } catch (error) {
      console.error('❌ Erro no fallback:', error);

      return {
        success: false,
        fallback: true,
        message: 'Erro ao gerar insights. Tente novamente mais tarde.',
        resumo: 'Análise indisponível',
        tendencias: [],
        alertas: [],
        classificacao: 'Indisponível',
      };
    }
  }
}