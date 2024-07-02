import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (_.isNil(user)) {
      throw new NotFoundException(
        `유저네임이 ${username}인 유저를 찾을수없습니다.`,
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get<string>('ACCESS_EXPIRES_IN'),
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
      }),
    };
  }

  async refreshToken(token: string) {
    try {
      const { username, sub } = this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
      });
      const payload = { username, sub };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('ACCESS_SECRET_KEY'),
          expiresIn: this.configService.get<string>('ACCESS_EXPIRES_IN'),
        }),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
