import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, firstName, lastName, phoneNumber } = createUserDto;

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new BadRequestException('이미 사용중인 사용자 이름입니다.');
    }
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const profile = this.profileRepository.create({
      firstName,
      lastName,
      phoneNumber,
    });

    const user = this.userRepository.create({
      username,
      email,
      password,
      profile,
      points: 1000000,
    });

    return await this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException(`유저네임이 ${username}인 유저를 찾을수없습니다.`);
    }
    return user;
  }

  async updatePhoneNumber(username: string, updatePhoneNumberDto: UpdatePhoneNumberDto): Promise<User> {
    const { password, phoneNumber } = updatePhoneNumberDto;

    const user = await this.findOne(username);
    if (_.isNil(user)) {
      throw new NotFoundException(`유저네임이 ${username}인 유저를 찾을수없습니다.`);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    user.profile.phoneNumber = phoneNumber;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async removeUser(username: string, password: string): Promise<void> {
    const user = await this.findOne(username);
    if (_.isNil(user)) {
      throw new NotFoundException(`유저네임이 ${username}인 유저를 찾을수없습니다.`);
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    await this.userRepository.softDelete(user.id);
  }
}
