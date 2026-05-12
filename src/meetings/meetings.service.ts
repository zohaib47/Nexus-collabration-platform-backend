import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
  ) {}

  // 1. Schedule a new meeting with Conflict Detection
  async schedule(hostId: string, dto: CreateMeetingDto): Promise<Meeting> {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    // Check if start time is in the past
    if (start < new Date()) {
      throw new BadRequestException('Cannot schedule meetings in the past');
    }

    // Logic: Check if start is before end
    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }

    // Logic: Conflict detection
    // Check if host or invitee is already in an ACCEPTED meeting during this slot
    const conflict = await this.meetingModel.findOne({
      status: 'ACCEPTED',
      $or: [
        { hostId: new Types.ObjectId(hostId) },
        { inviteeId: new Types.ObjectId(hostId) },
        { hostId: new Types.ObjectId(dto.inviteeId) },
        { inviteeId: new Types.ObjectId(dto.inviteeId) },
      ],
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      throw new BadRequestException('Time slot is already booked for one of the participants');
    }

    const newMeeting = new this.meetingModel({
      ...dto,
      hostId: new Types.ObjectId(hostId),
      inviteeId: new Types.ObjectId(dto.inviteeId),
      startTime: start,
      endTime: end,
      status: 'PENDING', 
    });

    return newMeeting.save();
  }

  // 2. Accept or Reject a meeting
  async updateStatus(id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<Meeting> {
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new BadRequestException('Invalid status. Use ACCEPTED or REJECTED');
    }

    const meeting = await this.meetingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();

    if (!meeting) {
      throw new BadRequestException('Meeting not found');
    }

    return meeting;
  }

  async remove(id: string) {
  const result = await this.meetingModel.findByIdAndDelete(id);
  
  if (!result) {
    throw new NotFoundException(`Meeting with ID ${id} not found`);
  }
  
  return {
    message: 'Meeting deleted successfully',
    deletedId: id
  };
}

  // 3. Get all meetings for a user (For Frontend Calendar Sync)
  async getUserMeetings(userId: string): Promise<Meeting[]> {
    return this.meetingModel.find({
      $or: [
        { hostId: new Types.ObjectId(userId) },
        { inviteeId: new Types.ObjectId(userId) }
      ]
    })
    .sort({ startTime: 1 }) 
    .populate('hostId', 'name email') 
    .populate('inviteeId', 'name email') 
    .exec();
  }
}

