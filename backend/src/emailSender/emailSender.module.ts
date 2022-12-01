import { Module } from '@nestjs/common';
import { EmailSenderService } from './emailSender.service';

@Module({
  exports: [EmailSenderService],
  providers: [EmailSenderService],
})
export class EmailSenderModule {}
