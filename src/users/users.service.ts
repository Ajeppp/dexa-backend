import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private employeesService: EmployeesService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(
    username: string,
    pass: string,
    role: string,
    nik: string,
    fullName: string,
    position: string,
    department: string,
  ): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(pass, salt);

      // 1. Save login account to db
      const newUser = this.usersRepository.create({
        username,
        password: hashedPassword,
        role,
      });
      const savedUser = await this.usersRepository.save(newUser);

      // If Success, save employee profile to the employee tabel using ID.
      const savedEmployee = await this.employeesService.create(
        savedUser.id,
        nik,
        fullName,
        position,
        department,
      );

      // 3. Send back the response
      return {
        message: 'Registrasi berhasil!',
        account: {
          id: savedUser.id,
          username: savedUser.username,
          role: savedUser.role,
        },
        profile: savedEmployee,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username atau NIK sudah terdaftar!');
      }
      throw error;
    }
  }
}
