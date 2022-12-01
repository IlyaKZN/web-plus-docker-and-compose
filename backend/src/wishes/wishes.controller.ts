import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: { user: User }) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req: { user: User }) {
    if (typeof id !== 'number') {
      throw new BadRequestException('Id должен быть числом');
    }
    return this.wishesService.copy(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/last')
  findLast() {
    return this.wishesService.findLast();
  }

  @UseGuards(JwtGuard)
  @Get('/top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    if (typeof id !== 'number') {
      throw new BadRequestException('Id должен быть числом');
    }
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: { user: User },
  ) {
    if (typeof id !== 'number') {
      throw new BadRequestException('Id должен быть числом');
    }
    return this.wishesService.update(+id, updateWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: { user: User }) {
    if (typeof id !== 'number') {
      throw new BadRequestException('Id должен быть числом');
    }
    return this.wishesService.remove(+id, req.user);
  }
}
