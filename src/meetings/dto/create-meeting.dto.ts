import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  inviteeId!: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string; // ISO String format (e.g., 2026-05-10T10:00:00Z)

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description?: string;
}