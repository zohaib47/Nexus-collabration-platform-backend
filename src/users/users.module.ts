import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {User, UserSchema} from './schemas/user.schema'
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService],
})
export class UsersModule {}
