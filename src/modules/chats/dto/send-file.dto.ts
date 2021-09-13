import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Url } from "url"

export class SendFile {
    @IsNotEmpty()
    @IsString()
    public telephone: string;

    @IsNotEmpty()
    @IsUrl()
    public fileUrl: Url;

    @IsNotEmpty()
    @IsString()
    public imageName: string;

    @IsOptional()
    @IsString()
    public caption?: string;
}