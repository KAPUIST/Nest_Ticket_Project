import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  @Patch('me/phone')
  async updatePhoneNumber(
    @Request() req,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ) {
    const username = req.username;
    return this.userService.updatePhoneNumber(username, updatePhoneNumberDto);
  }
  //유저 정보 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Request() req, @Body('password') password: string) {
    const username = req.username;
    return this.userService.removeUser(username, password);
  }
}
