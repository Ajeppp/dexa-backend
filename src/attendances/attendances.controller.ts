import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendancesService } from './attendances.service';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  // Endpoint: POST http://localhost:3000/attendances/check-in
  @Post('check-in')
  @UseInterceptors(FileInterceptor('image')) // 'image' adalah nama field di Postman nanti
  async checkIn(
    @UploadedFile() file: Express.Multer.File,
    @Body('employee_id') employeeId: string,
  ) {
    if (!employeeId) {
      throw new BadRequestException('employee_id wajib diisi!');
    }

    // Call service to upload and insert data to database
    return this.attendancesService.checkIn(Number(employeeId), file);
  }
}
