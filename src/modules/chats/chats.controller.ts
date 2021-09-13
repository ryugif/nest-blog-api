import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { messageDto } from '../whatsapp/dto/message.dto';
import { ChatsService } from './chats.service';
import { broadcastDto } from './dto/broadcast.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatPreview } from './dto/get-chat-preview.dto';
import { SyncMessage } from './dto/sync-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @Post('/send_message')
  sendMessage(@Body() sendMessage: CreateChatDto) {
    return this.chatsService.sendMessage(sendMessage);
  }

  @Post('/send_button')
  sendButton() {
    return this.chatsService.sendButton();
  }

  @Get('/chat_preview')
  async GetChatPreview(@Query() customers: GetChatPreview) {
    return await this.chatsService.getMessagePreview(customers.customer_id);
  }

  @Post('/send_broadcast')
  async SendBroadCast(@Body() body: broadcastDto) {
    return await this.chatsService.createBroadcast(body, '123');
  }

  @Get('/sync/:customerId')
  async SyncMessage(@Param('customerId') customer: string) {
    return await this.chatsService.SyncMessage(customer);
  }
}
