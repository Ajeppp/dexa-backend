import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() body: Record<string, any>, @Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException(
        'Hanya Admin yang diizinkan mendaftarkan karyawan baru!',
      );
    }

    const role = body.role || 'employee';

    return this.usersService.create(
      body.username,
      body.password,
      role,
      body.nik,
      body.full_name,
      body.position || 'Staff',
      body.department || 'General',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: Record<string, any>) {
    return this.authService.login(body.username, body.password);
  }
}
