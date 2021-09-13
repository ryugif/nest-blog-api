import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { chatsProviders } from './chats.provider';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ...chatsProviders],
  imports: [
    WhatsappModule,
    ScheduleModule.forRoot()
  ],
  exports: [ChatsService]
})
export class ChatsModule { }
