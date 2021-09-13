import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    HttpModule,
  ]
})
export class CustomerModule { }
