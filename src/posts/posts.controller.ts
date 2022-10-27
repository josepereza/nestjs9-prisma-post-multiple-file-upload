import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Patch,
  Body,
  Delete,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly prismaService: PrismaService) {}
  miauthorEmail!: string;
  Mipost = {
    author: null,
    content: 'la buena prueba',
    published: false,
    imagen: '',
    title: 'prueba',
  };
  /*  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  } */

  @Get('prueba')
  getPrueba(){
    this.Mipost.content = 'esta era dsfss otra prueba';
    return this.Mipost;
  }

  @Post('upload')
  @UseInterceptors(
     FilesInterceptor('files', 20, {
      //fileFilter: fileExtensionFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const nombrearchivo = Date.now() + path.extname(file.originalname);
          cb(null, nombrearchivo);
          this.miauthorEmail = req.body.author;
                
          
        },
      }),
    }),
  )
  public async uploadFile(
    @Body() uploadFileDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<void> {
    console.log(files);
    await this.prismaService.post.create({
      data: {
        title: uploadFileDto.title,
        content: uploadFileDto.content,
        imagen: files[0].filename,
        author: { connect: { email: uploadFileDto.author } },
      },
    });
  }

  /* @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  } */
}
