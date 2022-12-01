import { Injectable } from '@nestjs/common/decorators';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailSenderService {
  transporter = createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'KupiPodariDayBot@yandex.ru',
      pass: 'kwsejeixrirsmgxg',
    },
  });

  async sendEmail(emailList, messageText) {
    const message = {
      from: 'KupiPodariDay <KupiPodariDayBot@yandex.ru>',
      to: emailList,
      subject: 'Деньги на подарок собраны',
      text: messageText,
    };
    this.transporter.sendMail(message, (err, info) => {
      if (err) return console.log(err);
      console.log('Email sent: ', info);
    });
  }
}
