import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';

import { Parser } from 'json2csv';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>,
  ) {}

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
}
