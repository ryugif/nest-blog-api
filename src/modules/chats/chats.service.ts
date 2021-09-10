import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../core/constants';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { broadcastDto } from './dto/broadcast.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
@Injectable()
export class ChatsService {

  constructor(
    @Inject(forwardRef(() => WhatsappService))
    private readonly whatsAppService: WhatsappService,
    @Inject(CHAT_REPOSITORY) private readonly chat: typeof Chat,
  ) { }
  private logger = new Logger(ChatsService.name);

  async sendMessage(message: CreateChatDto) {
    await this.createMessage(message);
    return await this.whatsAppService.sendMessage({
      body: message.content,
      telephone: message.telephone
    });
  }

  async sendButton() {
    return await this.whatsAppService.sendGreetingMessage()
  }

  async createMessage(message: CreateChatDto) {
    await this.chat.create(message);
  }

  async createBroadcast(broadcast: broadcastDto) {
    //create chat
    // await this.chat;
    // telephone = broadcast.telephone
  }

}
