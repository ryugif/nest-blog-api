import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { whatsappProviders } from './whatsapp.provider';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, ...whatsappProviders],
  exports: [WhatsappService]
})
export class WhatsappModule { }
