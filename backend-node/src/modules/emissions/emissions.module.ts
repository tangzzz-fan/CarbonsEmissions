import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmissionsService } from './emissions.service';
import { EmissionsController } from './emissions.controller';
import { Emission } from './entities/emission.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([Emission]),
        HttpModule,
    ],
    controllers: [EmissionsController],
    providers: [EmissionsService],
})
export class EmissionsModule { } 