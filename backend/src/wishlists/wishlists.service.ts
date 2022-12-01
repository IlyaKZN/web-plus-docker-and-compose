import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishList } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private WishListRepository: Repository<WishList>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(createWishListDto: CreateWishlistDto, ownerId: number) {
    const wishes = await this.wishesService.find({
      id: In(createWishListDto.itemsId),
    });
    const owner = await this.usersService.findOne(ownerId);
    const wishList = { ...createWishListDto, owner: owner, items: wishes };
    delete wishList.itemsId;
    return this.WishListRepository.save(wishList);
  }

  async findAll(): Promise<WishList[]> {
    const wishlists = await this.WishListRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    if (wishlists.length < 1) {
      throw new NotFoundException('Списки желаний не найдены');
    }
    return wishlists;
  }

  async findOne(id: number): Promise<WishList> {
    const wishList = await this.WishListRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishList) {
      throw new NotFoundException('Списка желаний с данным id не существует');
    }
    return wishList;
  }

  async update(
    wishListId: number,
    updateWishListDto: UpdateWishlistDto,
    userId: number,
  ): Promise<WishList> {
    const wishList = await this.findOne(wishListId);
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException('Нельзя изменить чужой список подарков');
    }
    const wishes = await this.wishesService.find({
      id: In(updateWishListDto.itemsId),
    });
    await this.WishListRepository.update(wishListId, { items: wishes });
    return this.findOne(wishListId);
  }

  async remove(wishListId: number, userId) {
    const wishList = await this.findOne(wishListId);
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужой список подарков');
    }
    await this.WishListRepository.delete(wishListId);
    return wishList;
  }
}
