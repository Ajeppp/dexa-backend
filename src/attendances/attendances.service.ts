import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendances.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async checkIn(employeeId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Foto bukti WFH wajib di-upload!');
    }

    // Upload Image to cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(file);

    // Get current server time
    const currentTime = new Date();

    // Prepare data to insert to the database
    const newAttendance = this.attendancesRepository.create({
      employee_id: employeeId,
      check_in_time: currentTime,
      image_url: uploadResult.secure_url,
      status: 'WFH',
    });

    // Insert to database
    return this.attendancesRepository.save(newAttendance);
  }
}
