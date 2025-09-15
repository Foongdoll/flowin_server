import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent]), UsersModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}

