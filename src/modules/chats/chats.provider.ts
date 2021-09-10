import { CHAT_REPOSITORY } from "../../core/constants";
import { Chat } from "./entities/chat.entity";

export const chatsProviders = [
    {
        provide: CHAT_REPOSITORY,
        useValue: Chat,
    },
];
