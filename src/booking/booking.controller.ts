import {
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  Body,
  ParseIntPipe,
  Delete,
  Req,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookSeatDto } from './dto/book-seat.dto';
import _ from 'lodash';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('공연 예약')
@Controller('api/performances/bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('book-seat')
  @ApiOperation({ summary: '좌석 예매하기' })
  @ApiResponse({ status: 201, description: '좌석 예매 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async bookSeat(@Request() req, @Body() bookSeatDto: BookSeatDto) {
    const userId = req.user.id;
    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    return this.bookingService.bookSeat(userId, bookSeatDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '예매 취소하기' })
  @ApiResponse({ status: 200, description: '예매 취소 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async cancelBooking(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    await this.bookingService.cancelBooking(id, userId);
    return { message: '예매가 취소 되었습니다.' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-bookings')
  @ApiOperation({ summary: '나의 예매 목록 조회' })
  @ApiResponse({ status: 200, description: '나의 예매 목록 조회 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async findUserBookings(@Req() req) {
    const userId = req.user.id;

    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    return this.bookingService.findUserBookings(userId);
  }
}
