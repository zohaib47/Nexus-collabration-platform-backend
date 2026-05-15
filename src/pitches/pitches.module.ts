import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PitchesController } from './pitches.controller';
import { PitchesService } from './pitches.service';
import { Pitch, PitchSchema } from './schemas/pitch.schema';
import { AuthModule } from '../auth/auth.module'; // 1. AuthModule Import karein

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pitch.name, schema: PitchSchema }]),
    AuthModule, 
  ],
  controllers: [PitchesController],
  providers: [PitchesService],
})
export class PitchesModule {}