import { forwardRef, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { whatsappProviders } from './whatsapp.provider';
import { ChatsModule } from '../chats/chats.module';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, ...whatsappProviders],
  exports: [WhatsappService],
  imports: [forwardRef(() => ChatsModule)]
})
export class WhatsappModule { }
