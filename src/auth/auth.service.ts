import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt'; // 1. JwtService import karein

@Injectable()
export class AuthService {
  // 2. Constructor mein JwtService inject karein
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    // User ko dhoondein
    const user = await this.usersService.findOneByEmail(email);
    
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials (Email ya Password galat hai)');
    }

    // Token ke liye data (payload) tayyar karein
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    // Token return karein aur user ki basic info bhi
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}