import { Controller, Param, Post, Request, UseGuards, Body, ParseIntPipe } from '@nestjs/common';
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
    const userId = req.userId;
    return this.bookingService.bookSeat(userId, performanceId, { ...bookSeatDto });
  }
}
