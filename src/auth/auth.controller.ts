import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import {
  UserLoginDto,
  UserLoginResponse,
  UserRegisterDto,
  UserRegisterResponse,
} from 'src/users/user.types';
import { Public } from './auth.metadata';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {
    this.logger.log('AuthController created');
  }

  @Post('register')
  async register(
    @Body() userDto: UserRegisterDto,
  ): Promise<UserRegisterResponse> {
    return await this.authService.register(userDto);
  }

  @Public()
  @Get('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
    return await this.authService.login(userLoginDto);
  }
}
