import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

    @Column({ nullable: true })
    parentId: number;

    @ManyToOne(() => Menu, menu => menu.children)
    @JoinColumn({ name: 'parentId' })
    parent: Menu;

    @OneToMany(() => Menu, menu => menu.parent)
    children: Menu[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    hidden: boolean;

    @ManyToMany(() => Role, role => role.menus)
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}