import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  // Use employee ID to linking absent and employee data
  @Column()
  employee_id: number;

  // Catch date & time
  @Column()
  check_in_time: Date;

  // Save Image URL from Cloudinary
  @Column('text')
  image_url: string;

  @Column({ default: 'WFH' })
  status: string;
}
