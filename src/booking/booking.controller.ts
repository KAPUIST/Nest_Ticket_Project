import { Controller, Param, Post, Request, UseGuards, Body, ParseIntPipe, Delete, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookSeatDto } from './dto/book-seat.dto';

@Controller('api/performances')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':performanceId/book-seat')
  async bookSeat(
    @Request() req,
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body() bookSeatDto: BookSeatDto,
  ) {
    const userId = req.user.id;

    return this.bookingService.bookSeat(userId, performanceId, { ...bookSeatDto });
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':performanceId/bookings/:id')
  async cancelBooking(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    console.log(id, userId);
    await this.bookingService.cancelBooking(id, userId);
    return { message: '예매가 취소 되었습니다.' };
  }
}
