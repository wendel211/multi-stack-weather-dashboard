import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { IntegrationService } from './integration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListQueryDto } from './dto/list-query.dto';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pokemon')
  list(@Query() query: ListQueryDto) {
    const limit = query.limit ? Number(query.limit) : 20;
    const offset = query.offset ? Number(query.offset) : 0;

    return this.integrationService.list(limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pokemon/:name')
  detail(@Param('name') name: string) {
    return this.integrationService.detail(name);
  }
}
