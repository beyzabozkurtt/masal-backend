import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hashed });
    return this.generateToken(user);
  }

  async login(dto: any) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Kullanıcı yok');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Hatalı şifre');
    return this.generateToken(user);
  }

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({ sub: user._id, email: user.email }),
    };
  }
}