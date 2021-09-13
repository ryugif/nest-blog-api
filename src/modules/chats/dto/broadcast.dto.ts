import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class broadcastDto {
    @IsNotEmpty()
    @IsString()
    public body: string;

    @IsNotEmpty()
    @IsJSON()
    public customers: string;

    @IsOptional()
    @IsUrl()
    public image_url?: string;
}


export class broadcastCustomerInfo {
    @IsNotEmpty()
    @IsString()
    public telephone: string;

    @IsNotEmpty()
    @IsString()
    public customer_id: string
}
