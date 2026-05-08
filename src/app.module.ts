import { Module, Logger } from '@nestjs/common'; // Logger import karein
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}