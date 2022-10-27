import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      //fileFilter: fileExtensionFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const nombre = req.body.nombre;
          console.log(nombre);
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  // sending a response
}
