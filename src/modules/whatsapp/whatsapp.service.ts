import { forwardRef, Inject, Injectable, InternalServerErrorException, Logger, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { CHAT_REPOSITORY, WHATSAPP_REPOSITORY } from '../../core/constants';
import { ChatsService } from '../chats/chats.service';
import { messageDto } from './dto/message.dto';
import mime = require('mime-types');
import { Message } from 'venom-bot';
import { CreateChatDto } from '../chats/dto/create-chat.dto';
import { MessageType, SenderType } from '../../enums/chat.enum';
import { SendImage } from '../chats/dto/send-image.dto';
import { SendFile } from '../chats/dto/send-file.dto';
import { SendMessage } from '../chats/interface/send-message.interface';
import { CustomerService } from '../customer/customer.service';

const moment = require('moment');
const venom = require('venom-bot');
const fs = require('fs');

@Injectable()
export class WhatsappService implements OnModuleInit {

  constructor(
    private customerService: CustomerService,
    @Inject(forwardRef(() => ChatsService))
    private chatService: ChatsService,
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
        const checkCustomer = await this.customerService.findCustomerByTelephone(this.convertPhoneNumber(message.from, false));
        if (checkCustomer) {
          if (message.body === 'Hi') {
            await this.sendImage({
              telephone: message.from,
              imageUrl: new URL("https://cdn.discordapp.com/attachments/580654415145598977/885795152650731530/20210910_145302.jpg"),
              imageName: 'ini gambar',
              caption: '',
            });
          }
          await this.getAllChat(message.chatId)
        } else {

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
      const storagePath = 'storage/';
      const path = `file-message/${moment(message.timestamp * 1000).format('YYYY-MM-DD')}/aloha-`;
      if (!fs.existsSync('./' + storagePath + path)) {
        fs.mkdirSync('./' + storagePath + path, { recursive: true });
      }
      const fileName = `${moment().format('yyyy-MM-dd--HH-mm-ss-SSS')}.${mime.extension(message.mimetype)}`

      await fs.writeFile('./' + storagePath + path + fileName, buffer, (err) => {
        if (err) {
          this.logger.error('Error while getting message media')
          console.error(err)
          return
        }
      });
      return {
        path: path,
        fileName: fileName,
        fullPathName: path + fileName,
        mime: message.mimetype,
        url: `${process.env.APP_URL}${path + fileName}`,
        size: Buffer.from(buffer).length
      }
    } catch (err) {
      console.error(err)
    }
  }

  convertPhoneNumber(telephone: string | number, server: boolean = true): string {
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
    return result + (server ? '@c.us' : '');
  }

  async sendMessage(message: messageDto): Promise<SendMessage> {
    try {
      return this.client.sendText(this.convertPhoneNumber(message.telephone), message.body);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException()
    }
  }

  async sendImage(message: SendImage): Promise<SendImage> {
    try {
      return await this.client.sendImage(
        this.convertPhoneNumber(message.telephone),
        message.imageUrl.toString(),
        message.imageName,
        message.caption
      );
    } catch (error) {
      this.logger.error("failed to send image to " + message.telephone);
      throw new UnprocessableEntityException();
    }
  }

  async sendFile(message: SendFile): Promise<void> {
    try {
      await this.client.sendFile(
        this.convertPhoneNumber(message.telephone),
        message.fileUrl.toString(),
        message.imageName,
        message.caption
      );
    } catch (error) {
      this.logger.error("failed to send file to " + message.telephone);
      throw new UnprocessableEntityException();
    }
  }

  async loadMoreChat(chatId: string): Promise<Message[]> {
    const result: Message[] = await this.client.loadEarlierMessages(chatId);
    return result;
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

  async getAllChat(chatId: string) {
    try {
      const chats: Message[] = await this.client.getAllMessagesInChat(chatId);
      const messages: CreateChatDto[] = [];
      let count = 0;

      for (const chat of chats) {
        const findChat: number = await this.chatService.findMessageByChatId(chat.id);
        if (findChat <= 0) {
          if (chat.isMedia === true || chat.isMMS === true) {
            const messageMedia = await this.getMessageMedia(chat);
            chat.body = JSON.stringify(messageMedia);
          }
          messages.push(this.convertMessage(chat));
          count++
        } else if (findChat == 1) {
          await this.chatService.updateMessage(this.convertMessage(chat));
        }
      }
      await this.chatService.createBatchMessage(messages);

      if (count == chats.length) {
        await this.loadMoreChat(chatId);
        await this.getAllChat(chatId);
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async saveMessage(message: Message) {
    const createMessage: CreateChatDto = this.convertMessage(message);
    this.chatService.createMessage(createMessage)
  }

  private convertMessage(message: Message): CreateChatDto {
    const createMessage: CreateChatDto = {
      chat_id: message.id,
      content: message.body,
      telephone: this.convertPhoneNumber(message.from),
      customer_id: '123',
      user_id: message.sender.isMe ? '123' : null,
      raw_time: message.t,
      message_type: message.isMedia === true || message.isMMS === true ? MessageType.media : MessageType.text,
      receive_at: moment(message.t * 1000).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
      sender_type: message.sender.isMe ? SenderType.user : SenderType.customer,
      send_at: moment(message.t * 1000).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
    }

    return createMessage;
  }
}
