import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { Length, MaxLength } from 'class-validator';
import { BaseEntity } from '../../utils/abstract-classes';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class WishList extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({
    default: '',
  })
  @MaxLength(1500)
  description: string;

  @Column()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishList, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishLists)
  owner: User;
}
