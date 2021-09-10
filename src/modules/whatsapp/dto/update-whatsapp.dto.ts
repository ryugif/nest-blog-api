import { PartialType } from '@nestjs/mapped-types';
import { CreateWhatsappDto } from './create-whatsapp.dto';

export class UpdateWhatsappDto extends PartialType(CreateWhatsappDto) {}
