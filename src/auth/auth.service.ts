import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
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

  async login(email: string, pass: string, requestedRole: string) {
    // 1. Database se user dhoondein
    const user = await this.usersService.findOneByEmail(email);
    
    // 2. Email aur Password check karein
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials (Email ya Password galat hai)');
    }

    // 3. Safety Check: Agar frontend se role nahi aaya (undefined fix)
    if (!requestedRole) {
      throw new BadRequestException('Role selection zaroori hai!');
    }

    // 4. Role Validation (Case-Insensitive)
    if (user.role.toLowerCase() !== requestedRole.toLowerCase()) {
      console.log(`Role Mismatch! DB: ${user.role}, Request: ${requestedRole}`); 
      throw new UnauthorizedException(
        `Aapka account as an ${user.role} registered hai, ${requestedRole} nahi.`
      );
    }

    // Agar sab theek hai toh token return karein
    return this.generateToken(user);
  }

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

  async generateToken(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id || user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id || user.id,
        email: user.email,
       fullName: user.fullName,
        role: user.role
      }
    };
  }
}