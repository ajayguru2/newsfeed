import { Body, Controller, Headers, Logger, Post } from '@nestjs/common';
import { Role } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.metadata';
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

  @Roles(Role.Admin)
  @Post('register-admin')
  async registerAdmin(
    @Headers() headers: Record<string, string>,
    @Body() userDto: UserRegisterDto,
  ): Promise<UserRegisterResponse> {
    const token = headers.authorization.split(' ')[1];
    this.logger.log(
      `Admin is trying to register a new user with token ${token}`,
    );
    return await this.authService.registerAdmin(userDto, token);
  }

  @Public()
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
    this.logger.log(`User ${userLoginDto.email} is trying to log in`);
    return await this.authService.login(userLoginDto);
  }

  @Post('me')
  async me(@Headers() headers: Record<string, string>) {
    const token = headers.authorization.split(' ')[1];
    this.logger.log(`User is trying to get their profile with token ${token}`);
    return await this.authService.me(token);
  }
}
