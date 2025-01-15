import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Check API status',
  })
  @ApiOkResponse({ description: 'API is up and running' })
  @Get()
  statusCheck(): string {
    return 'API is running';
  }
}
