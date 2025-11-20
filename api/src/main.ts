import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Criar admin automaticamente
  const usersService = app.get(UsersService);
  await usersService.ensureAdminUser();

  await app.listen(3000);
}
bootstrap();
