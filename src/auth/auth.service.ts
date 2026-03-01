import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, pass: string) {
    // find user using username
    const user = await this.usersService.findOne(username);

    // reject if username not found
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // checking the credential match or not
    const isMatch = await bcrypt.compare(pass, user.password);

    // error handling if credential wrong
    if (!isMatch) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // if success give the user JWT token authentication
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
