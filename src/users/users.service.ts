import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

 
async findInvestors() {
  return this.userModel.find({ role: 'investor' }).exec(); 
}

async findOneByEmail(email: string): Promise<User | null> {
  return await this.userModel.findOne({ email }).exec();
}

 async findOne(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async updateOtp(userId: string, otp: string | null, expiry: Date | null) {
  return await this.userModel.findByIdAndUpdate(userId, {
    otp: otp,
    otpExpires: expiry,
  }, { returnDocument: 'after' });
 }

//  verify OTP logic

async verifyOTP(email: string, otp: string) {
  const user = await this.userModel.findOne({ email });

  if (!user) throw new NotFoundException('User nahi mila');

  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw new BadRequestException('OTP galat hai ya expire ho chuka hai');
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();
  return { message: 'Account verified successfully!' };
}

}