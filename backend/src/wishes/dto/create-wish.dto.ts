import { Length, IsNotEmpty, IsUrl, Min } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Min(1)
  price: number;

  @Length(1, 1024)
  description: string;
}
