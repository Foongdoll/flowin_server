import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Note } from './entities/note.entity';
import { CalendarEvent } from './entities/calendar-event.entity';
import { Document } from './entities/document.entity';
import { Friendship } from './entities/friendship.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { NotesModule } from './notes/notes.module';
import { EventsModule } from './events/events.module';
import { DocsModule } from './docs/docs.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/files',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data/dev.db',
      entities: [User, Post, Note, CalendarEvent, Document, Friendship],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    NotesModule,
    EventsModule,
    DocsModule,
    ChatModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
