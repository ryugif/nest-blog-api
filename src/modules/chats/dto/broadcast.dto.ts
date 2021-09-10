import { IsJSON, IsNotEmpty, IsString } from "class-validator";

export class broadcastDto {
    @IsNotEmpty()
    @IsString()
    public body: string;

    @IsNotEmpty()
    @IsJSON()
    public telephone: string;
}
