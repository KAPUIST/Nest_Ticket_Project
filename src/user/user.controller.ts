import { Body, Controller, Delete, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';

import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('유저')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //유저 조회 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 프로필 조회' })
  @ApiResponse({ status: 200, description: '유저 프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getProfile(@Request() req) {
    const username = req.user.username;
    return this.userService.findOne(username);
  }
  //유저 정보 수정
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me/phone')
  @ApiOperation({ summary: '유저 전화번호 수정' })
  @ApiResponse({ status: 200, description: '유저 전화번호 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async updatePhoneNumber(@Request() req, @Body() updatePhoneNumberDto: UpdatePhoneNumberDto) {
    const username = req.user.username;
    return this.userService.updatePhoneNumber(username, updatePhoneNumberDto);
  }
  //유저 정보 삭제
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('me')
  @ApiOperation({ summary: '유저 삭제' })
  @ApiResponse({ status: 200, description: '유저 삭제 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBody({
    description: '삭제를 위한 비밀번호',
    schema: { type: 'object', properties: { password: { type: 'string', example: 'password123' } } },
  })
  async remove(@Request() req, @Body('password') password: string) {
    const username = req.user.username;
    return this.userService.removeUser(username, password);
  }
}
