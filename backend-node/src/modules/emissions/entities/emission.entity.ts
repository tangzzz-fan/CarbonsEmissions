import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('emissions')
export class Emission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    value: number;

    @Column()
    unit: string;

    @Column()
    source: string;

    @Column({ type: 'timestamp' })
    measurementTime: Date;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 