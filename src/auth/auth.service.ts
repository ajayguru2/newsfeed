import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserLoginDto,
  UserLoginResponse,
  UserRegisterDto,
  UserRegisterResponse,
} from 'src/users/user.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserRegisterDto): Promise<UserRegisterResponse> {
    const user = await this.userService.create(userDto);
    return {
      httpsCode: 201,
      message: 'User created successfully',
      user,
    };
  }

  async registerAdmin(
    userDto: UserRegisterDto,
    token: string,
  ): Promise<UserRegisterResponse> {
    const payload = await this.jwtService.verifyAsync(token);
    if (payload) {
      const user = await this.userService.createAdmin(userDto);
      return {
        httpsCode: 201,
        message: 'Admin created successfully',
        user,
      };
    } else {
      return {
        httpsCode: 401,
        message: 'Unauthorized',
      };
    }
  }

  async login(userDto: UserLoginDto): Promise<UserLoginResponse> {
    const user = await this.userService.findByEmail(userDto.email);
    if (user) {
      if (user.password !== userDto.password) {
        return {
          httpsCode: 401,
          message: 'Wrong password',
        };
      }
      return {
        httpsCode: 200,
        message: 'User logged in successfully',
        token: await this.jwtService.signAsync({
          email: user.email,
          id: user._id,
        }),
      };
    } else {
      return {
        httpsCode: 404,
        message: 'User not found',
      };
    }
  }

  async me(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    if (payload) {
      const user = await this.userService.findOne(payload.id);
      return user;
    } else {
      return {
        httpsCode: 401,
        message: 'Unauthorized',
      };
    }
  }
}
