import { Employee } from 'src/employees/entities/employee.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  // Use employee ID to linking absent and employee data
  @Column()
  employee_id: number;

  // Clock In Time
  @Column()
  check_in_time: Date;

  // Clock Out Time
  @Column({ nullable: true })
  check_out_time: Date;

  @Column({ type: 'text', nullable: true })
  check_out_image_url: string;

  // Save Image URL from Cloudinary
  @Column('text')
  image_url: string;

  @Column({ default: 'WFH' })
  status: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
