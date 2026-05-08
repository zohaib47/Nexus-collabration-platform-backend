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
import { RolesGuard } from '@/auth/guard/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('investor-only')
  @Roles('investor') // Sirf investor roles allow hain
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getInvestorSpecialData() {
    return { message: 'Welcome Investor! your private data.' };
  }

  @Get('entrepreneur-dashboard')
@Roles('entrepreneur') // Sirf entrepreneur aa sakta hai
@UseGuards(AuthGuard('jwt'), RolesGuard)
getEntrepreneurData() {
  return { 
    message: "Welcome Entrepreneur! Here you manage your startup idea." 
  };
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
