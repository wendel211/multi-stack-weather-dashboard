import { Controller, Get, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('weather')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  getInsights() {
    return this.insightsService.generateInsights();
  }
}
