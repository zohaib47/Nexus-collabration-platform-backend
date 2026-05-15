import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/auth/decorators/roles.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Signup ke liye ye open rehna chahiye (Validation already main.ts mein hai)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // FIXED: Ab sirf logged-in users hi list dekh saktay hain
  findAll() {
    return this.usersService.findAll();
  }

  // UsersController ke andar add karein

@Get('investors')
@UseGuards(AuthGuard('jwt')) 
async findInvestors() {
  return this.usersService.findInvestors();
}

  @Get('investor-only')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles('investor') 
  getInvestorSpecialData() {
    return { message: 'Welcome Investor! your private data.' };
  }

  @Get('entrepreneur-dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('entrepreneur') 
  getEntrepreneurData() {
    return { 
      message: "Welcome Entrepreneur! Here you manage your startup idea." 
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt')) 
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) 
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles('investor', 'entrepreneur') 
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}