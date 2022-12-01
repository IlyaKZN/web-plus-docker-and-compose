import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';
import { BaseEntity } from '../../utils/abstract-classes';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { WishList } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @MaxLength(200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => WishList, (wishList) => wishList.owner)
  wishLists: WishList[];
}
