import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Header,
  UseGuards
} from '@nestjs/common';

import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /** 
   * Endpoint usado exclusivamente pelo worker Go
   * Não tem JWT 
   */
  @Post('logs')
  create(@Body() dto: CreateWeatherDto) {
    return this.weatherService.create(dto);
  }

  /**
   * Endpoint consumido pelo frontend (autenticado)
   */
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  findAll(@Query() query: QueryWeatherDto) {
    return this.weatherService.findAll(query);
  }

  /**
   * Export CSV
   */
  @UseGuards(JwtAuthGuard)
  @Get('export.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=weather.csv')
  async exportCSV() {
    return this.weatherService.exportCSV();
  }

  /**
   * Export XLSX
   */
  @UseGuards(JwtAuthGuard)
  @Get('export.xlsx')
  async exportXLSX(@Res() res: Response) {
    const buffer = await this.weatherService.exportXLSX();

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=weather.xlsx',
    });

    res.send(buffer);
  }

  /**
   * 🚀 Novo: Gerar Insights via IA
   */
  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async generateInsights() {
    return this.weatherService.generateInsights();
  }
}
