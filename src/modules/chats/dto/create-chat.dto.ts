import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ChatPriority, MessageType, SenderType } from "../../../enums/chat.enum";

export class CreateChatDto {

    @IsOptional()
    @IsString()
    public chat_id?: string;

    @IsNotEmpty()
    @IsString()
    public content: string;

    @IsNotEmpty()
    @IsString()
    public telephone: string;

    @IsNotEmpty()
    @IsEnum(ChatPriority)
    public priority?: ChatPriority = ChatPriority.LOW;

    @IsOptional()
    @IsEnum(MessageType)
    public message_type?: MessageType = MessageType.text;

    @IsOptional()
    @IsEnum(SenderType)
    public sender_type?: SenderType = SenderType.user;

    @IsOptional()
    @IsNumber()
    public raw_time?: number;

    @IsOptional()
    @IsDate()
    public receive_at?: Date;

    @IsOptional()
    @IsDate()
    public read_at?: Date;

    @IsOptional()
    @IsDate()
    public send_at?: Date;

    @IsNotEmpty()
    @IsString()
    public customer_id: string;

    @IsOptional()
    @IsString()
    public user_id?: string;
}
