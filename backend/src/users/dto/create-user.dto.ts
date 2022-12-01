import { Length, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  about: string;

  avatar: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  password: string;
}
