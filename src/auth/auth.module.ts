import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PassportModule } from '@nestjs/passport'; // Import already there
import { OtpService } from '@/common/services/otp.service';
import { MailService } from '@/common/services/mail.service';

@Module({
  imports: [
   forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy, RolesGuard, OtpService, MailService,],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule] 
})
export class AuthModule {}