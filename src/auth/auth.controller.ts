import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('인증')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //유저 회원가입
  @Post('register')
  @ApiOperation({ summary: '유저 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: '유저 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리프레시 토큰 발급 Authorization 에 리프레쉬토큰을 등록해주세요.' })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 400, description: '리프레시 토큰이 없습니다.' })
  async refresh(@Req() req) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) {
      throw new BadRequestException('리프레쉬 토큰이 없습니다.');
    }
    return this.authService.refreshToken(refreshToken);
  }
}
