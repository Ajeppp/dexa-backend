import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  nik: string;

  @Column()
  full_name: string;

  @Column()
  position: string;

  @Column()
  department: string;
}
