import {
  ForbiddenException,
  HttpException,
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скидываться на свой подарок');
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new HttpException('Превышена стоимость подарка', 400);
    }
    const offer = { ...createOfferDto, user: user, item: wish };
    const savedOffer = await this.offerRepository.save(offer);
    await this.wishesService.updateRaised(wish.id);
    const updatedWish = await this.wishesService.findOne(createOfferDto.itemId);
    if (updatedWish.raised === updatedWish.price) {
      this.wishesService.sendMail(updatedWish);
    }
    return savedOffer;
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find();
    if (offers.length < 1) {
      throw new NotFoundException('Предложения скинуться не найдены');
    }
    return offers;
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
    if (!offer) {
      throw new NotFoundException(
        'Предложение скинуться с данным id не найдено',
      );
    }
    return offer;
  }
}
