
import {Controller,Get,Post,Put, Patch,Delete,Param, Body,UseInterceptors,UploadedFile,BadRequestException, NotFoundException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

const uploadPath = join(process.cwd(), 'src', 'uploads');

mkdirSync(uploadPath, { recursive: true });

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, dto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {dest: uploadPath, limits: { fileSize: 2 * 1024 * 1024,},
  fileFilter: (_req, file, callback) => {
    if (/\.(jpg|jpeg|png|pdf)$/i.test(file.originalname)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Invalid file type'), false);
    }
  },
}))
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,)
     {
    if (!file) {
      throw new BadRequestException(
        'A valid file is required (maximum size: 2MB)',
      );
    }

    return this.courseService.uploadCourseMaterial(id, file);
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${file.originalname}`;
          cb(null, name);
        },
      }),
    }),
  )
 uploadProfile(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/ }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return {
    message: 'Profile image uploaded successfully',
    file,
  };
}

@Get('profile/:filename')
downloadProfile(
  @Param('filename') filename: string,
  @Res() res: Response,
) {
  const filePath = join(
    process.cwd(),
    'uploads',
    basename(filename),
  );

  if (!existsSync(filePath)) {
    throw new NotFoundException('Image not found');
  }

  return res.download(filePath);
}
}

