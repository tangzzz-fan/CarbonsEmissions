import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

    @Column('timestamp')
    measurementTime: Date;

    @ManyToOne(() => User, user => user.emissions)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 