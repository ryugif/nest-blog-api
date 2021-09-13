import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class GetChatPreview {
    @IsNotEmpty()
    @IsArray()
    public customer_id: string[];
}