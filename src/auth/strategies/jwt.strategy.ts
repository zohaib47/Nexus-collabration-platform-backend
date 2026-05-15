import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(configService: ConfigService) {
  const secret = configService.get<string>('JWT_SECRET');
  console.log('Backend Secret Check:', secret);
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env file');
  }
  

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: secret,
  });
}
// src/auth/strategies/jwt.strategy.ts

async validate(payload: any) {
  // Terminal mein check karein ke properties ke naam kya hain
  console.log('Validating Payload:', payload);

  // Agar payload null hai ya sub/id dono missing hain
  if (!payload || (!payload.sub && !payload.id)) {
    console.log('Validation Failed: No User ID found in payload');
    return null; 
  }

  // NestJS Guard ko 'user' object chahiye hota hai
  const user = { 
    userId: payload.sub || payload.id, 
    email: payload.email, 
    role: payload.role 
  };

  console.log('Returning User Object to Guard:', user);
  return user;
}
}