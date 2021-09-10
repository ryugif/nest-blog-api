import { CHAT_REPOSITORY, WHATSAPP_REPOSITORY } from '../../core/constants';
import { Chat } from '../chats/entities/chat.entity';
import { Whatsapp } from './entities/whatsapp.entity';

export const whatsappProviders = [
    {
        provide: WHATSAPP_REPOSITORY,
        useValue: Whatsapp,
    },
    {
        provide: CHAT_REPOSITORY,
        useValue: Chat,
    },
];
