import { BadRequestException, Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Inject, ParseIntPipe, Post, Query, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UpdateUserDto } from './vo/udpate-user.dto';
import { isEmpty, isNaN, isNumber, toNumber } from "lodash"
import { generateParseIntPipe } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return 'done';
  }


  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser);
    return await this.userService.register(registerUser);
  }



  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
    return vo;
  }

  @Get('list')
  async list(
      @Query('pageNo',new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
      @Query('pageSize',new DefaultValuePipe(1), generateParseIntPipe('pageSize')) pageSize: number,
      @Query('username') username: string,
      @Query('nickName') nickName: string,
  ) {
      return await this.userService.findUsers(username, nickName,pageNo, pageSize);
  }
  



  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    console.log(isEmpty(userId))
    if (isEmpty(userId)) {
      throw new HttpException('缺少参数', HttpStatus.BAD_REQUEST);
    }
    if (isNumber(userId)) {

    }
    console.log(isNaN(toNumber(userId)))
    if (isNaN(toNumber(userId))) {
      throw new HttpException('参数不合法', HttpStatus.BAD_REQUEST);
    }
    await this.userService.freezeUserById(userId);
    return 'success';
  }


  @Get('info')
  @RequireLogin()
  @UseInterceptors(ClassSerializerInterceptor)
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    return user;
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto);
  }


  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }




}

