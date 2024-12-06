import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  statusCheck(): string {
    return 'API is running';
  }
}
