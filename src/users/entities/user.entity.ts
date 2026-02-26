import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Ini memberitahu TypeORM untuk nge-link ke tabel 'users' di MySQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 INI DIA YANG DITANGISI SAMA TYPESCRIPT! Pastikan baris ini ada.
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'employee'], default: 'employee' })
  role: string;
}
