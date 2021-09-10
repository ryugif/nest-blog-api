import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { chatsProviders } from './chats.provider';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ...chatsProviders],
  imports: [WhatsappModule],
  exports: [ChatsService]
})
export class ChatsModule { }
