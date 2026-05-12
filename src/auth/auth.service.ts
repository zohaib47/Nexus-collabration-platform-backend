import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt'; // 1. JwtService import karein
import { OtpService } from '@/common/services/otp.service';
import { MailService } from '@/common/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,   
    private mailService: MailService,
  ) {}

  async register(dto: CreateUserDto) {
    const userExists = await this.usersService.findOneByEmail(dto.email);
    if (userExists) {
      throw new BadRequestException('Email pehle se registered hai!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  // 3. Login Logic yahan add karein

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials (Email ya Password galat hai)');
    }

    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // otp genrate and send email
  async sendTwoFactorCode(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User nahi mila');

    const otp = this.otpService.generateOtp();
    console.log(`[DEBUG] Generated OTP for User: ${otp}`);
    const expiry = this.otpService.getExpiryTime(5); 

    await this.usersService.updateOtp(userId, otp, expiry);

    await this.mailService.sendOTP(user.email, otp);

    return { message: 'OTP aapki email par bhej diya gaya hai.' };
  }


  // otp verify  
async verifyTwoFactorCode(userId: string, code: string) {
  const user = await this.usersService.findOne(userId);


  if (!user) {
    throw new UnauthorizedException('User nahi mila!');
  }

  if (!user.otp || user.otp !== code || this.otpService.isOtpExpired(user.otpExpires!)) {
    throw new UnauthorizedException('OTP galat hai ya expire ho chuka hai');
  }

  await this.usersService.updateOtp(userId, null, null);

  return { message: 'Verification kamyab rahi!' };
}
}