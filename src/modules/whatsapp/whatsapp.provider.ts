import { WHATSAPP_REPOSITORY } from '../../core/constants';
import { Whatsapp } from './entities/whatsapp.entity';

export const whatsappProviders = [
    {
        provide: WHATSAPP_REPOSITORY,
        useValue: Whatsapp,
    },
];
