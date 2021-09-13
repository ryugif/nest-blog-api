import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Url } from "url"

export class SendImage {
    @IsNotEmpty()
    @IsString()
    public telephone: string;

    @IsNotEmpty()
    @IsUrl()
    public imageUrl: Url;

    @IsNotEmpty()
    @IsString()
    public imageName: string;

    @IsOptional()
    @IsString()
    public caption?: string;
}