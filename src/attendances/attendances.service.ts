import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  // check in function
  async checkIn(userId: number, file: Express.Multer.File) {
    // search Employee profile
    const employee = await this.employeesService.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan tidak ditemukan untuk akun ini.',
      );
    }

    // [Handling double check in: START]
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await this.attendancesRepository.findOne({
      where: {
        employee_id: employee.id,
        check_in_time: Between(todayStart, todayEnd),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Anda sudah melakukan Check-in hari ini!');
    }
    // [Handling double check in: END]

    if (!file) {
      throw new BadRequestException('Foto bukti Check-in wajib di-upload!');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    const newAttendance = this.attendancesRepository.create({
      employee_id: employee.id,

      check_in_time: new Date(),
      image_url: uploadResult.secure_url,
      status: 'WFH',
    });

    return this.attendancesRepository.save(newAttendance);
  }

  // check out function
  async checkOut(userId: number, file: Express.Multer.File) {
    const employee = await this.employeesService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Profil karyawan tidak ditemukan.');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendance = await this.attendancesRepository.findOne({
      where: {
        employee_id: employee.id,
        check_in_time: Between(todayStart, todayEnd),
      },
    });

    if (!todayAttendance) {
      throw new BadRequestException('Kamu belum melakukan Check-in hari ini!');
    }

    if (todayAttendance.check_out_time) {
      throw new BadRequestException('Kamu sudah melakukan Check-out hari ini!');
    }

    if (!file) {
      throw new BadRequestException('Foto bukti Check-out wajib di-upload!');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);

    todayAttendance.check_out_time = new Date();
    todayAttendance.check_out_image_url = uploadResult.secure_url;

    return this.attendancesRepository.save(todayAttendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendancesRepository.find({
      relations: ['employee'],
      order: {
        check_in_time: 'DESC',
      },
    });
  }
}
