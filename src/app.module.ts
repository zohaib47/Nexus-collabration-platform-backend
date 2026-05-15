import { Module, Logger } from '@nestjs/common'; // Logger import karein
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { CloudinaryService } from './config/cloudinary.service';
import { CloudinaryProvider } from './config/cloudinary.config';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PitchesModule } from './pitches/pitches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection with Logger logic
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
          // Jab connection build ho jaye
          if (connection.readyState === 1) {
            Logger.log('✅ MongoDB Connected Successfully!', 'Database');
          }

          // Agar koi error aaye
          connection.on('error', (error) => {
            Logger.error(`❌ MongoDB Connection Error: ${error}`, 'Database');
          });

          return connection;
        },
      }),
    }),
    
    UsersModule,
    AuthModule,
    MeetingsModule,
    DocumentsModule,
    PaymentsModule,
    PitchesModule,
  ],
  controllers: [AppController, ],
  providers: [AppService, CloudinaryProvider, CloudinaryService,
    Reflector, 
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class AppModule {}