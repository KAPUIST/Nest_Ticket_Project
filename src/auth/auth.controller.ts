import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //유저 회원가입
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) {
      throw new BadRequestException('리프레쉬 토큰이 없습니다.');
    }
    return this.authService.refreshToken(refreshToken);
  }
}
