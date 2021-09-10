import { Inject, Injectable, Logger, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { WHATSAPP_REPOSITORY } from '../../core/constants';
import { CreateWhatsappDto } from './dto/create-whatsapp.dto';
import { messageDto } from './dto/message.dto';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';
import { Whatsapp } from './entities/whatsapp.entity';
const venom = require('venom-bot');

@Injectable()
export class WhatsappService implements OnModuleInit {

  constructor(
    @Inject(WHATSAPP_REPOSITORY) private readonly whatsapp: typeof Whatsapp
  ) { }
  private readonly logger = new Logger(WhatsappService.name);
  private client;

  onModuleInit() {
    venom.create(
      'sales',
      (base64Qr, asciiQR, attempts, urlCode) => {
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response: any = {};

        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');

        var imageBuffer = response;
        let imageName = Date.parse(new Date().toISOString());
        require('fs').writeFile(
          `storage/qr-scan/${imageName}.png`,
          imageBuffer['data'],
          'binary',
          function (err) {
            if (err != null) {
              console.log(err);
            }
          }
        );
      },
      undefined,
      { logQR: false }
    ).then((salesClient) => {
      this.client = salesClient;
      this.venomFunction(this.client)
    });
  }

  private venomFunction(client) {
    client.onMessage((message) => {
      this.logger.log(message.body)
      if (message.body === 'Hi' && message.isGroupMsg === false) {
        client
          .sendText(message.from, 'Welcome Venom 🕷')
          .then((result) => {
            console.log('Result: ', result);
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro);
          });
      }
    });

    client.onStateChange(state => {
      this.logger.log(state);
    });
  }

  convertPhoneNumber(telephone: string | number): string {
    const regex = '/[^0-9]/';
    let result = '';

    telephone = telephone.toString();
    telephone = telephone.replace(" ", "")
    telephone = telephone.replace("(", "")
    telephone = telephone.replace(")", "")
    telephone = telephone.replace(".", "")
    telephone = telephone.replace("+", "")
    telephone = telephone.trim();

    if (!telephone.match(regex)) {
      if (telephone.substr(0, 2) == '62') {
        result = telephone;
      } else if (telephone.substr(0, 1) == '0') {
        result = '62' + telephone.substr(1);
      }
    }
    return result + '@c.us';
  }

  async sendMessage(message: messageDto) {
    try {
      return this.client.sendText(this.convertPhoneNumber(message.telephone), message.body);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException()
    }
  }

  async sendGreetingMessage() {
    try {
      await this.client.sendText(
        '6281391386392@c.us',
        `Halo Pelanggan setia Raja Dinar.\n\nTerima kasih sudah menghubungi kami.\nKami adalah pemotongan ayam yang dapat menyesuaikan dg kebutuhan Anda.\n\nSilahkan pilih lokasi Anda \nKetik 1 untuk wilayah *JABODETABEK* \nKetik 2 untuk wilayah *Luar Pulau Jawa*\nKetik 3 untuk *Produk/Sampingan*\nKetik 4 untuk pendaftaran *RESELLER*`);
    } catch (error) {
      this.logger.error(error)
    }
  }

  async sendWelcomeMessage(message: messageDto) {
    message.body = `Terima kasih, sales yang bersangkutan akan segera menghubungi anda`;
    this.client.sendText(this.convertPhoneNumber(message.telephone), message.body)
  }

  async checkDeviceConnection() {
    return await this.client.getConnectionState();
  }
}
