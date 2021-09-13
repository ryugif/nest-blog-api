import { forwardRef, Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { whatsappProviders } from './whatsapp.provider';
import { ChatsModule } from '../chats/chats.module';
import { CustomerModule } from '../customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, ...whatsappProviders],
  exports: [WhatsappService],
  imports: [
    CustomerModule,
    ScheduleModule.forRoot(),
    forwardRef(() => ChatsModule)
  ]
})
export class WhatsappModule { }
