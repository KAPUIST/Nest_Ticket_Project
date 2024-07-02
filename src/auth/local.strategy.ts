import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import _ from 'lodash';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (_.isNil(user)) {
      throw new UnauthorizedException('인증정보가 올바르지 않습니다.');
    }
    return user; // 이 사용자가 `req.user`에 저장됩니다.
  }
}
