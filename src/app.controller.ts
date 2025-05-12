import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('/')
@ApiExcludeController(true)
export class AppController {
  @Get()
  healthcheck() {
    return {
      status: 200,
      message: 'OK',
    };
  }
}
