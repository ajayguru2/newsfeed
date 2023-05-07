import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './roles/roles.enum';
import { Roles } from './roles/roles.metadata';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(Role.Admin)
  @Get('/test')
  getTest(): string {
    return 'test';
  }
}
