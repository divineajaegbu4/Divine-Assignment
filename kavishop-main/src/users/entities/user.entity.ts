import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  CUSTOMER = 'CUSTOMER',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Column({ type: 'uuid', name: 'id', primary: true })
  id!: string;

  @Column({ unique: true, name: 'email', nullable: false })
  email!: string;

  @Column({ name: 'password', nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @Column({ name: 'first_name', nullable: true })
  first_name?: string;

  @Column({ name: 'last_name', nullable: true })
  last_name?: string;

  @Column({ type: 'varchar', nullable: true })
  avatar_url?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
