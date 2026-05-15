import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pitch } from './schemas/pitch.schema';

@Injectable()
export class PitchesService {
  constructor(@InjectModel(Pitch.name) private pitchModel: Model<Pitch>) {}

  async upsertPitch(userId: string, data: any) {
    // Agar pehle se draft hai toh update, warna naya create
    return this.pitchModel.findOneAndUpdate(
      { entrepreneurId: userId, startupName: data.startupName },
      { ...data, entrepreneurId: userId },
      { upsert: true, new: true }
    );
  }

  async findAllPublished() {
    return this.pitchModel.find({ status: 'published' }).sort({ createdAt: -1 });
  }

  async findByEntrepreneur(userId: string) {
    return this.pitchModel.find({ entrepreneurId: userId });
  }
}