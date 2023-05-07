import { User } from './user.schema';

export type UserRegisterResponse = {
  httpsCode: number;
  message: string;
  user?: User;
};

export type UserLoginResponse = {
  httpsCode: number;
  message: string;
  token?: string;
};

export type UserRegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type UserLoginDto = {
  email: string;
  password: string;
};
