import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../core/constants';
import { messageDto } from '../whatsapp/dto/message.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { broadcastDto } from './dto/broadcast.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {

  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chat: typeof Chat,
    private readonly whatsAppService: WhatsappService,
  ) { }

  async sendMessage(message: messageDto) {
    await this.createMessage(message);
    return await this.whatsAppService.sendMessage(message)
  }

  async sendButton() {
    return await this.whatsAppService.sendGreetingMessage()
  }

  async createMessage(message: messageDto) {
    const createMessage = {
      content: message.body,
      telephone: this.whatsAppService.convertPhoneNumber(message.telephone),
      customer_id: '123',
      user_id: '123'
    }
    await this.chat.create(createMessage);
  }

  async createBroadcast(broadcast: broadcastDto) {
    //create chat
    // await this.chat;
    // telephone = broadcast.telephone
  }

}
