import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity';
import { PerformanceModule } from './performance/performance.module';
import { BookingModule } from './booking/booking.module';
import { SeatModule } from './seat/seat.module';
import { PaymentModule } from './payment/payment.module';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    synchronize: configService.get('DB_SYNC'),
    logging: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_SECRET_KEY: Joi.string().required(),
        REFRESH_SECRET_KEY: Joi.string().required(),
        ACCESS_EXPIRES_IN: Joi.string().required(),
        REFRESH_EXPIRES_IN: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PerformanceModule,
    BookingModule,
    SeatModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
