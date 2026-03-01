import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
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

  async update(id: number, updateData: any): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Karyawan dengan ID ${id} tidak ditemukan.`);
    }

    Object.assign(employee, updateData);
    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<{ message: string }> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Karyawan dengan ID ${id} tidak ditemukan.`);
    }

    await this.employeesRepository.delete(id);
    return { message: `Data karyawan ${employee.full_name} berhasil dihapus.` };
  }
}
