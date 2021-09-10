import { forwardRef, Inject, Injectable, Logger, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { CHAT_REPOSITORY, WHATSAPP_REPOSITORY } from '../../core/constants';
import { ChatsService } from '../chats/chats.service';
import { Chat } from '../chats/entities/chat.entity';
import { messageDto } from './dto/message.dto';
import { Whatsapp } from './entities/whatsapp.entity';
import mime = require('mime-types');
import { Message } from 'venom-bot';
import { CreateChatDto } from '../chats/dto/create-chat.dto';
import { MessageType, SenderType } from '../../enums/chat.enum';

const moment = require('moment');
const venom = require('venom-bot');
const fs = require('fs');

@Injectable()
export class WhatsappService implements OnModuleInit {

  constructor(
    @Inject(forwardRef(() => ChatsService))
    private chatService: ChatsService
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
    client.onMessage(async (message: Message) => {
      if (message.isGroupMsg === false) {
        if (message.isMedia === true || message.isMMS === true) {
          await this.getMessageMedia(message);
        } else {
          await this.getAllChat(message)
          await this.saveMessage(message);
        }
      }
    });

    client.onStateChange(state => {
      this.logger.log(state);
      // if ('CONFLICT'.includes(state)) client.useHere();
      if ('UNPAIRED'.includes(state)) console.log('logout');
    });

    let time = 0;
    client.onStreamChange((state) => {
      // console.log('State Connection Stream: ' + state);
      // clearTimeout(time);
      // if (state === 'DISCONNECTED' || state === 'SYNCING') {
      //   time = setTimeout(() => {
      //     client.close();
      //   }, 80000);
      // }
    });
  }

  private async getMessageMedia(message: Message) {
    try {
      const buffer = await this.client.decryptFile(message);
      const fileName = `aloha.${mime.extension(message.mimetype)}`;

      const path = `./storage/file-message/aloha-${new Date(),
        'yyyy-MM-dd--HH-mm-ss-SSS'
        }.${mime.extension(message.mimetype)}`

      await fs.writeFile(path, buffer, (err) => {
        if (err) {
          this.logger.error('Error while getting message media')
          console.error(err)
          return
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  convertPhoneNumber(telephone: string | number): string {
    const regex = '/[^0-9]/';
    let result = '';

    telephone = telephone.toString();
    telephone = telephone.replace("@c.us", "")
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

  async getAllChat(message: Message) {
    const chat = await this.client.getAllMessagesInChat(message.chatId);
    fs.writeFileSync('./storage/all-messages.json', JSON.stringify(chat));
  }

  async saveMessage(message: Message) {
    const createMessage: CreateChatDto = {
      content: message.body,
      telephone: this.convertPhoneNumber(message.from),
      customer_id: '123',
      user_id: '123',
      raw_time: message.t,
      message_type: MessageType.text,
      receive_at: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
      sender_type: SenderType.customer,
      send_at: moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
    }

    console.log(MessageType.text)
    this.chatService.createMessage(createMessage)
  }
}
