import {
  Injectable,
  ForbiddenException,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { EmailSenderService } from 'src/emailSender/emailSender.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private usersService: UsersService,
    private emailSenderService: EmailSenderService,
    @Inject(forwardRef(() => OffersService))
    private readonly offersService: OffersService,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number) {
    const user = await this.usersService.findOne(ownerId);
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find();
    if (wishes.length < 1) {
      throw new NotFoundException('Желаемые подарки не найдены');
    }
    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: true,
        wishList: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Желаемый подарок с данным id не найден');
    }
    return wish;
  }

  async find(options): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: options,
      relations: {
        owner: true,
      },
    });
    if (wishes.length < 1) {
      throw new NotFoundException(
        'Желаемые подарки по данным параметрам не найдены',
      );
    }
    return wishes;
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        owner: true,
        wishList: true,
      },
      take: 40,
    });
    if (wishes.length < 1) {
      throw new NotFoundException('Желаемые подарки не найдены');
    }
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      relations: {
        owner: true,
        wishList: true,
      },
      take: 20,
    });
    if (wishes.length < 1) {
      throw new NotFoundException('Желаемые подарки не найдены');
    }
    return wishes;
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя изменить чужой подарок');
    }
    if (
      (updateWishDto.description || updateWishDto.price) &&
      wish.offers.length !== 0
    ) {
      throw new ForbiddenException(
        'Нельзя изменить описание или стоимость подарка, когда уже есть желающие скинуться',
      );
    }
    await this.wishRepository.update(id, updateWishDto);

    return this.findOne(id);
  }

  async updateRaised(wishId: number) {
    const wish = await this.findOne(wishId);
    let raised = 0;
    wish.offers.forEach((offer) => {
      raised += offer.amount;
    });
    await this.wishRepository.update(wishId, { raised: raised });
  }

  async remove(id: number, user: User) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== user.id) {
      if (wish.owner.id !== user.id) {
        throw new ForbiddenException('Нельзя удалить чужой подарок');
      }
    }
    await this.wishRepository.delete(id);
    return wish;
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    await this.wishRepository.increment({ id: wishId }, 'copied', 1);
    return this.create(
      {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      },
      userId,
    );
  }

  async sendMail(wish: Wish) {
    const emails = [];
    const loop = async () => {
      for (const offer of wish.offers) {
        const findedOffer = await this.offersService.findOne(offer.id);
        if (emails.indexOf(findedOffer.user.email) === -1) {
          emails.push(findedOffer.user.email);
        }
      }
    };
    await loop();

    emails.forEach((email) => {
      this.emailSenderService.sendEmail(
        [email],
        `Ссылка на подарок 'http://localhost:3000/gift/${wish.id}'
        Изображение подарка ${wish.image}
        Адреса желающих скинуться ${emails.filter((el) => el !== email)}
        `,
      );
    });
  }
}
