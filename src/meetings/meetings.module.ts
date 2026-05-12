import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting, MeetingSchema } from './schemas/meeting.schema'; // Path sahi check karlein
import { VideoGateway } from './video.gateway';

@Module({
  imports: [

    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }])
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, VideoGateway],
  exports: [MeetingsService] 
})
export class MeetingsModule {}


