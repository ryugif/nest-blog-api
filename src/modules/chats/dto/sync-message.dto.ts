import { IsNotEmpty, IsString } from "class-validator";

export class SyncMessage {
    @IsNotEmpty()
    @IsString()
    public telephone: string;
}