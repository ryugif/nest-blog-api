import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateWhatsappDto } from './dto/create-whatsapp.dto';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';
import { messageDto } from './dto/message.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) { }

  // @Post('/send_message')
  // postMessage(@Body('message') message: string) {
  //   const data: messageDto = { body: message, telephone: '081391386392' };
  //   return this.whatsappService.sendMessage(data);
  // }
}
