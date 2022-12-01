import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  findOne(@Req() req: { user: User }) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  getWishes(@Req() req: { user: User }) {
    return req.user.wishes;
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  update(@Req() req: { user: User }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto.query);
  }
}
