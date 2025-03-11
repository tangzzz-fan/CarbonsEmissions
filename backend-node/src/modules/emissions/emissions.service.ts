import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emission } from './entities/emission.entity';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmissionsService {
    constructor(
        @InjectRepository(Emission)
        private emissionsRepository: Repository<Emission>,
        private httpService: HttpService,
        private configService: ConfigService,
    ) { }

    async create(createEmissionDto: CreateEmissionDto, userId: number): Promise<Emission> {
        const emission = this.emissionsRepository.create({
            ...createEmissionDto,
            user: { id: userId },
        });
        return this.emissionsRepository.save(emission);
    }

    async findAll(): Promise<Emission[]> {
        return this.emissionsRepository.find({
            relations: ['user'],
        });
    }

    async findOne(id: number): Promise<Emission> {
        const emission = await this.emissionsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!emission) {
            throw new NotFoundException(`Emission with ID ${id} not found`);
        }
        return emission;
    }

    async update(id: number, updateEmissionDto: UpdateEmissionDto): Promise<Emission> {
        const emission = await this.findOne(id);
        Object.assign(emission, updateEmissionDto);
        return this.emissionsRepository.save(emission);
    }

    async remove(id: number): Promise<void> {
        const emission = await this.findOne(id);
        await this.emissionsRepository.remove(emission);
    }

    async predict(data: any): Promise<any> {
        const pythonApiUrl = this.configService.get('pythonApi.url');
        const response = await firstValueFrom(
            this.httpService.post(`${pythonApiUrl}/predict`, data)
        );
        return response.data;
    }
} 