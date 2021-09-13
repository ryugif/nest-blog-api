import { forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import moment = require('moment');
import { SenderType } from '../../enums/chat.enum';
import { CHAT_REPOSITORY } from '../../core/constants';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { broadcastCustomerInfo, broadcastDto } from './dto/broadcast.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { SendMessage } from './interface/send-message.interface';
@Injectable()
export class ChatsService {

  constructor(
    @Inject(forwardRef(() => WhatsappService))
    private readonly whatsAppService: WhatsappService,
    @Inject(CHAT_REPOSITORY) private readonly chat: typeof Chat,
    private schedulerRegistry: SchedulerRegistry,
  ) { }
  private logger = new Logger(ChatsService.name);

  async sendMessage(message: CreateChatDto) {
    const data: SendMessage = await this.whatsAppService.sendMessage({
      body: message.content,
      telephone: message.telephone
    });

    const date: Date = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

    message.chat_id = data.to._serialized;
    message.read_at = date;
    message.receive_at = date;
    message.send_at = date;
    message.raw_time = moment().unix()

    await this.createMessage(message);

    return {
      status: 'success',
      message: "Message has been sent"
    };
  }

  async createMessage(message: CreateChatDto): Promise<Chat> {
    return await this.chat.create(message);
  }

  async createBatchMessage(messages: CreateChatDto[]) {
    await this.chat.bulkCreate(messages);
  }

  async updateMessage(message: CreateChatDto) {
    await this.chat.update({
      raw_time: message.raw_time,
      receive_at: message.receive_at,
      send_at: message.send_at,
    }, {
      where: {
        chat_id: message.chat_id
      }
    });
  }

  private isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  async findMessageByChatId(chat_id: string): Promise<number> {
    return await this.chat.count({ where: { chat_id } });
  }

  private sort(prop: any, arr: any[]) {
    return arr.sort(function (a, b) {
      var keyA = new Date(a[prop]),
        keyB = new Date(b[prop]);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }

  async getMessagePreview(customerId: string[]): Promise<{ customer_id: string, message?: object, unread: number }[]> {
    try {
      if (customerId.length > 0) {
        const results = [];
        for (const customer of customerId) {
          const message = await this.chat.findOne({
            attributes: {
              exclude: ['deletedAt', 'chat_id']
            },
            where: {
              customer_id: customer
            },
            order: [
              ['raw_time', 'DESC'],
              ['createdAt', 'DESC'],
            ]
          });
          const unreadCount = await this.chat.count({
            where: {
              customer_id: customer,
              read_at: null,
              sender_type: SenderType.customer
            }
          });

          const result = {
            customer_id: customer,
            message: message,
            unread: unreadCount
          };
          results.push(result)
        }
        console.log(results)

        return this.sort('createdAt', results);
      } else {
        throw new UnprocessableEntityException()
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async createBroadcast(broadcast: broadcastDto, user_id: string) {
    try {
      const customers: broadcastCustomerInfo[] = JSON.parse(broadcast.customers);
      let timeInit = 3500;

      for (const customer of customers) {
        const deliveredTime: number = timeInit += 3500;
        const date: Date = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
        const data: Chat = await this.createMessage({
          content: broadcast.body,
          telephone: customer.telephone,
          customer_id: customer.customer_id,
          user_id: user_id,
          read_at: date,
          receive_at: date,
          send_at: date,
          raw_time: moment().unix()
        });

        await this.addQueue(data, data.id, deliveredTime, broadcast.image_url ?? null);
      }

      return {
        status: 'success',
        message: "Broadcast has been created, message will be delivered soon"
      };
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  private async addQueue(chat: Chat, key: string, time: number, imageUrl?: string) {
    const callback = async () => {
      let deliveredMessage;
      if (!imageUrl) {

        deliveredMessage = await this.whatsAppService.sendMessage({
          body: chat.content,
          telephone: chat.telephone
        });
      } else {
        deliveredMessage = await this.whatsAppService.sendImage({
          imageName: `Broadcast-image-${chat.raw_time}`,
          imageUrl: new URL(imageUrl),
          telephone: chat.telephone,
          caption: chat.content
        });
      }

      await this.chat.update({
        chat_id: deliveredMessage.to._serialized,
      }, {
        where: {
          id: chat.id,
          raw_time: chat.raw_time
        }
      });

      this.schedulerRegistry.deleteInterval(key);
    };

    const interval = setInterval(callback, time);
    this.schedulerRegistry.addInterval(key, interval);
  }

  async SyncMessage(telephone: string) {
    const chatId = this.whatsAppService.convertPhoneNumber(telephone);
    const findMessage = await this.chat.findOne({
      where: {
        telephone: chatId
      }
    });

    if (findMessage) {
      await this.whatsAppService.getAllChat(chatId);

      return {
        status: 'success',
        message: "Message has been syncronize"
      }
    } else {
      throw new NotFoundException("This customer is not registered")
    }
  }

}
