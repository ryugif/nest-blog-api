import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { messageDto } from '../whatsapp/dto/message.dto';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post('/send_message')
  sendMessage(@Body() sendMessage: messageDto) {
    return this.chatsService.sendMessage(sendMessage);
  }

  @Post('/send_button')
  sendButton() {
    return this.chatsService.sendButton();
  }
}
