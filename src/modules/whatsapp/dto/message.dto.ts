import { IsNotEmpty, IsString } from "class-validator";

export class messageDto {
    @IsNotEmpty()
    @IsString()
    public body: string;

    @IsNotEmpty()
    public telephone: string;
}
