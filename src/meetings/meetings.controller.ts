import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  Patch, 
  Param, 
  Get,
  Delete
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.gard'; 

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  // 1. Schedule a new meeting
  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async schedule(@Req() req: any, @Body() dto: CreateMeetingDto) {
    const hostId = req.user.userId; // JWT payload se id nikalna
    return this.meetingsService.schedule(hostId, dto);
  }

  // 2. Accept or Reject a meeting
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED'
  ) {
    return this.meetingsService.updateStatus(id, status);
  }

  // 3. Get all meetings for the logged-in user (Calendar Sync ke liye)
  @UseGuards(JwtAuthGuard)
  @Get('my-calendar')
  async getMyMeetings(@Req() req: any) {
    const userId = req.user.userId;
    return this.meetingsService.getUserMeetings(userId);
  }
  @Delete(':id')
async deleteMeeting(@Param('id') id: string) {
  return this.meetingsService.remove(id);
}
}