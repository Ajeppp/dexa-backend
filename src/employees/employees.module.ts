import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Import TypeOrmModule
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity'; // 👈 Import Entity-nya

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],

  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
