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

@Controller('api/performances/bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('book-seat')
  async bookSeat(@Request() req, @Body() bookSeatDto: BookSeatDto) {
    const userId = req.user.id;
    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    return this.bookingService.bookSeat(userId, bookSeatDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancelBooking(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    await this.bookingService.cancelBooking(id, userId);
    return { message: '예매가 취소 되었습니다.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async findUserBookings(@Req() req) {
    const userId = req.user.id;

    if (_.isNil(userId)) {
      throw new BadRequestException('유저를 찾지 못했습니다.');
    }
    return this.bookingService.findUserBookings(userId);
  }
}
