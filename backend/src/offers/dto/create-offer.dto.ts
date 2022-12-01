import { Min, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsNotEmpty()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
