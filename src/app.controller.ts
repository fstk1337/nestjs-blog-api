import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/v1/user')
  getUser() {
    return {
      id: 1,
      name: 'Vasya',
      email: 'vasya@mail.ru',
      age: 41
    }
  }
}
