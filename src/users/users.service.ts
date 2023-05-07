import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: User): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: User): Promise<User | Error> {
    const user = this.findOne(id);
    if (user) {
      return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    } else {
      return Error('User not found');
    }
  }

  async remove(id: string): Promise<User | Error> {
    const user = this.findOne(id);
    if (user) {
      return this.userModel.findByIdAndRemove(id);
    } else {
      return Error('User not found');
    }
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
