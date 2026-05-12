import { Controller, Post, Body, UseGuards , Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
async login(@Body() body: any) {
  return this.authService.login(body.email, body.password);
}

@UseGuards(JwtAuthGuard) 
@Post('request-otp')
async requestOtp(@Req() req) {
  return this.authService.sendTwoFactorCode(req.user.userId);
}

@UseGuards(JwtAuthGuard)
@Post('verify-otp')
async verifyOtp(@Req() req, @Body('code') code: string) {
  return this.authService.verifyTwoFactorCode(req.user.userId, code);
}
}