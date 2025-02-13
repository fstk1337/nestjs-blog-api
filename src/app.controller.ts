import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user')
  getUser() {
    return {
      id: 1,
      name: 'Vasya',
      email: 'vasya@mail.ru',
      age: 41
    }
  }
}
