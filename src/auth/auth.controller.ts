import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';
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

  @Public()
  @Post('register')
  async register(
    @Body() userDto: UserRegisterDto,
  ): Promise<UserRegisterResponse> {
    return await this.authService.register(userDto);
  }

  @Post('register-admin')
  async registerAdmin(
    @Headers() headers: Record<string, string>,
    @Body() userDto: UserRegisterDto,
  ): Promise<UserRegisterResponse> {
    const token = headers.authorization.split(' ')[1];
    return await this.authService.registerAdmin(userDto, token);
  }

  @Public()
  @Get('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
    return await this.authService.login(userLoginDto);
  }
}
