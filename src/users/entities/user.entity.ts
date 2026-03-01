import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // link to 'users' tabel in MySQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // username harus unique
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'employee'], default: 'employee' })
  role: string;
}
