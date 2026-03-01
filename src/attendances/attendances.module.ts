import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Attendance } from './entities/attendances.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), EmployeesModule],
  controllers: [AttendancesController],
  providers: [AttendancesService, CloudinaryService],
})
export class AttendancesModule {}
