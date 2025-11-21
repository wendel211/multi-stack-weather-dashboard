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
// 🚀 INTEGRAÇÃO COM IA-SERVICE
// ---------------------------
async generateInsights() {
  try {
    const AI_URL = process.env.AI_URL ?? "http://ai-service:8001";

    // endpoint correto
    const response = await axios.post(`${AI_URL}/generate`, {
      temperature: 25, // coloque valores reais ou deixe para o front mandar
      humidity: 50,
      wind: 10,
      condition: "Clear",
    });

    return {
      success: true,
      ...response.data,
    };

  } catch (error: any) {
    console.error("❌ Erro ao chamar IA-Service:", error.message);

    return {
      success: false,
      fallback: true,
      message: "Não foi possível gerar insights no momento.",
    };
  }
}
}
