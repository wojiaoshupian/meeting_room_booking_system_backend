import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @RequireLogin()
  @RequirePermission("ddd","ccc")
  aaaa(@UserInfo() user:string) {
    console.log("-----")
    console.log(user)

    return 'aaa';
  }

  @Get('bbb')
  bbb(@UserInfo('username') username:string) {
    console.log("-----")
    console.log(username)
    return 'bbb';
  }

}
