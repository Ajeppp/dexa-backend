import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
  Get,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendancesService } from './attendances.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  @UseInterceptors(FileInterceptor('image'))
  async checkIn(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Foto bukti WFH wajib di-upload!');
    }

    const employeeId = req.user.userId;

    return this.attendancesService.checkIn(employeeId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('check-out')
  @UseInterceptors(FileInterceptor('image'))
  async checkOut(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const employeeId = req.user.userId;

    return this.attendancesService.checkOut(employeeId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Unauthorized User!');
    }
    return this.attendancesService.findAll();
  }
}
