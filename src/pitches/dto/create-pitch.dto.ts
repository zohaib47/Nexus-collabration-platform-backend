// dto/create-pitch.dto.ts
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreatePitchDto {
  @IsString()
  startupName!: string;

  @IsString()
  industry!: string;

  @IsString()
  pitchTitle!: string;

  @IsString()
  problemSolved!: string;

  @IsString()
  solution!: string;

  @IsNumber()
  fundingGoal!: number;

  @IsNumber()
  equityOffered!: number;

  @IsOptional()
  @IsString()
  videoLink?: string;

  @IsOptional()
  @IsArray()
  milestones?: string[];

  @IsOptional()
  @IsString()
  teamSize?: string;

  @IsEnum(['draft', 'published'])
  status!: string;
}