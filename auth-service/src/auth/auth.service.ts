/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    public userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  register(registerDto: RegisterDto) {
    return this.userRepository.register(registerDto);
  }

  login(loginDto: LoginDto) {
    return this.userRepository.login(loginDto);
  }
}
