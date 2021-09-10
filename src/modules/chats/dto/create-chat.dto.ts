import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty()
    @IsString()
    readonly body: string;

    @IsNotEmpty()
    public telephone: string;

    @IsNotEmpty()
    public customer_id: string;

    @IsNotEmpty()
    public user_id: string;
}
