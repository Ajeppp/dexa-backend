import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findByUserId(userId: number): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { user_id: userId } });
  }

  async create(
    userId: number,
    nik: string,
    fullName: string,
    position: string,
    department: string,
  ): Promise<Employee> {
    const newEmployee = this.employeesRepository.create({
      user_id: userId,
      nik,
      full_name: fullName,
      position,
      department,
    });
    return this.employeesRepository.save(newEmployee);
  }
}
