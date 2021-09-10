import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { whatsappProviders } from '../whatsapp/whatsapp.provider';
import { chatsProviders } from './chats.provider';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ...chatsProviders, WhatsappService, ...whatsappProviders],
})
export class ChatsModule { }
