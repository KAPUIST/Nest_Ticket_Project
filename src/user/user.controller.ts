import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //유저 조회 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.userService.findOne(req.username);
  }
  //유저 정보 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  async updatePhoneNumber(
    @Param('username') username: string,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ) {
    return this.userService.updatePhoneNumber(username, updatePhoneNumberDto);
  }
  //유저 정보 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  async remove(
    @Param('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.removeUser(username, password);
  }
}
