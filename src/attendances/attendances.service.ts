import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendances.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
    private cloudinaryService: CloudinaryService,
    private employeesService: EmployeesService,
  ) {}

  // Parameter yang masuk ke sini adalah userId (angka 5) dari token
  async checkIn(userId: number, file: Express.Multer.File) {
    // 1. KITA CARI DULU SIAPA KARYAWAN YANG PUNYA AKUN ID 5 INI
    const employee = await this.employeesService.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan tidak ditemukan untuk akun ini.',
      );
    }

    if (!file) {
      throw new BadRequestException('Foto bukti WFH wajib di-upload!');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    // 2. RAKIT DATA ABSEN
    const newAttendance = this.attendancesRepository.create({
      // 👇 INI BIANG KEROKNYA KALAU MASIH ERROR!
      // Harus pakai employee.id (dari hasil pencarian di atas), JANGAN pakai userId!
      employee_id: employee.id,

      check_in_time: new Date(),
      image_url: uploadResult.secure_url,
      status: 'WFH',
    });

    return this.attendancesRepository.save(newAttendance);
  }
}
