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

  /** endpoint usado pelo worker Go */
  @Post('logs')
  create(@Body() dto: CreateWeatherDto) {
    return this.weatherService.create(dto);
  }

  /** endpoint consumido pelo frontend */
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  findAll(@Query() query: QueryWeatherDto) {
    return this.weatherService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=weather.csv')
  async exportCSV() {
    return this.weatherService.exportCSV();
  }

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
}
