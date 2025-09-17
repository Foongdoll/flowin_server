import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import { DocsService } from './docs.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('docs')
export class DocsController {
  constructor(private docs: DocsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.docs.list(req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) =>
          cb(null, join(process.cwd(), 'uploads', 'docs')),
        filename: (req, file, cb) => {
          const rand = randomBytes(8).toString('hex');
          cb(null, `${Date.now()}-${rand}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body('title') title?: string,
  ) {
    const path = ['docs', file.filename].join('/');
    return this.docs.create({
      title: title || file.originalname,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      path,
      userId: req.user?.sub,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docs.remove(id);
  }
}
