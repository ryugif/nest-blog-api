import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ChatPriority, MessageType, SenderType } from "../../../enums/chat.enum";

export class CreateChatDto {
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

    @IsNotEmpty()
    @IsNumber()
    public raw_time: number;

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsString()
    public user_id: string;
}
