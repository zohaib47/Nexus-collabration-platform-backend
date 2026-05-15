import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.gard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { CreatePitchDto } from './dto/create-pitch.dto';

@Controller('pitches')
export class PitchesController {
  constructor(private readonly pitchesService: PitchesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('entrepreneur')
  @Post()
  async createOrUpdatePitch(@Body() pitchData: CreatePitchDto, @Request() req) {

    const userId = req.user.userId;
    return this.pitchesService.upsertPitch(userId, pitchData);
  }


  @Get('all')
  async getPublishedPitches() {
    return this.pitchesService.findAllPublished();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('entrepreneur')
  @Get('my-pitches')
  async getMyPitches(@Request() req) {
    const userId = req.user.userId;
    return this.pitchesService.findByEntrepreneur(userId);
  }
}