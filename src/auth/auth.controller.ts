import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: Record<string, any>) {
    const role = body.role || 'user'; // Default role is 'user' if not provided
    const user = await this.usersService.create(
      body.username,
      body.password,
      role,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: Record<string, any>) {
    return this.authService.login(body.username, body.password);
  }
}
