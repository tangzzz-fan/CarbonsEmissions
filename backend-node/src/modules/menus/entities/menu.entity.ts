import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('menus')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    path: string;

    @Column({ nullable: true })
    component: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ default: 0 })
    sort: number;

    @ManyToOne(() => Menu, menu => menu.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Menu;

    @OneToMany(() => Menu, menu => menu.parent)
    children: Menu[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Role, role => role.menus)
    roles: Role[];
}