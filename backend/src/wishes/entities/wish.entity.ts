import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { BaseEntity } from '../../utils/abstract-classes';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { WishList } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column({
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  copied: number;

  @ManyToOne(() => WishList, (wishList) => wishList.items)
  wishList: WishList;
}
