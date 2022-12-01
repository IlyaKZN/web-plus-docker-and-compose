import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    const isPasswordsMathced = await bcrypt.compare(password, user.password);
    if (!isPasswordsMathced) {
      throw new BadRequestException('Неправильный логин или пароль');
    }
    if (user && isPasswordsMathced) {
      delete user.password;
      return user;
    }

    return null;
  }
}
