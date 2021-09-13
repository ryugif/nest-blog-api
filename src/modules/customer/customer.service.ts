import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Cache } from 'cache-manager'
import { Auth } from '../../enums/auth.enum';
import { CacheData } from './instances/cache-data.instance';
@Injectable()
export class CustomerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
  ) { }

  async login(): Promise<CacheData> {
    const auth: CacheData = await this.cacheManager.get(Auth.authorization);
    if (!auth) {
      const data = await this.httpService.post(process.env.CRM_API_URL + 'auth/login', {
        username: process.env.CRM_USERNAME,
        password: process.env.CRM_PASS
      }).toPromise();

      const cacheData: CacheData = { ...data.data, loginAt: new Date().toISOString() };
      await this.cacheManager.set(Auth.authorization, cacheData, { ttl: 0 });
      const callback = async () => {
        await this.cacheManager.del(Auth.authorization);
        this.schedulerRegistry.deleteTimeout(Auth.authorization);
      };

      if (this.findTimeout(Auth.authorization)) {
        this.schedulerRegistry.deleteTimeout(Auth.authorization);
      }
      const timeout = setTimeout(callback, cacheData.expireIn);
      this.schedulerRegistry.addTimeout(Auth.authorization, timeout);

      return cacheData;
    } else {
      return auth;
    }
  }

  private findTimeout(key: string): boolean {
    try {
      this.schedulerRegistry.getTimeout(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async findCustomerByTelephone(telephone: string) {
    const token = (await this.login()).token;
    const findCustomer = await this.httpService.get(`${process.env.CRM_API_URL}customers/find_telephone`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }).toPromise();

    return findCustomer.data > 0 ? true : false;
  }
}
