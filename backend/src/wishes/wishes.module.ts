import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { UsersModule } from 'src/users/users.module';
import { EmailSenderModule } from 'src/emailSender/emailSender.module';
import { OffersModule } from 'src/offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    UsersModule,
    EmailSenderModule,
    forwardRef(() => OffersModule),
  ],
  exports: [WishesService],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
