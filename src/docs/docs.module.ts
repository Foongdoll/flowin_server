import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), UsersModule],
  providers: [DocsService],
  controllers: [DocsController],
})
export class DocsModule {}
