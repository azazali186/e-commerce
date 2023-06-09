/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AES, enc } from 'crypto-js';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const { name, email, password } = registerDto;
    const oldUser = await this.findOne({
      where: {
        email,
      },
    });
    if (oldUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User registered with ${email} email`,
      });
    }
    const hashPassord = AES.encrypt(
      password,
      process.env.ENCRYPTION_KEY,
    ).toString();
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashPassord;
    await user.save();
    // return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: `User not registered with ${email} email`,
      });
    }

    const hashPassord = AES.decrypt(
      user.password,
      process.env.ENCRYPTION_KEY,
    ).toString(enc.Utf8);
    if (hashPassord === password) {
      const { password, status, ...others } = user;
      const payload = { sub: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET}`,
      });
      return { ...others, token: token };
    }

    throw new NotFoundException({
      statusCode: 404,
      message: `Email and password combination incorrect`,
    });
  }
}
