import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { ChatsModule } from './modules/chats/chats.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      exclude: ['/api*'],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostsModule,
    ChatsModule,
    WhatsappModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
