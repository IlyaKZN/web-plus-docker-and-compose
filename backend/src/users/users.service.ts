import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/utils-functions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = hashPassword(createUserDto.password);
    const user = await this.usersRepository.create({
      ...createUserDto,
      password,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (users.length < 1) {
      throw new NotFoundException('Пользователи не найдены');
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        wishes: true,
        wishLists: true,
        offers: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с данным id не найден');
    }
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (users.length < 1) {
      throw new NotFoundException(
        'По данным параметрам пользователи не найдены',
      );
    }
    return users;
  }

  async findUserWishes(username: string) {
    const user = await this.findByUsername(username);
    if (user.wishes.length < 1) {
      throw new NotFoundException(
        'У данного пользователя нет желаемых подарков',
      );
    }
    return user.wishes;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
        wishLists: true,
        offers: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        'Пользователь с данным именем пользователя не найден',
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = hashPassword(updateUserDto.password);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
    return user;
  }
}
