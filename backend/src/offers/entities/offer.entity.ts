import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/abstract-classes';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers, {
    cascade: true,
  })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
