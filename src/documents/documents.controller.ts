/// <reference types="multer" />
import { 
  Controller, 
  Post, 
  Get,
  Delete,
  UseInterceptors, 
  UploadedFile, 
  Body, 
  Param,
  Req,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  
  constructor(private readonly documentsService: DocumentsService) {}

  // 1. Upload Document
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Body('title') title: string
  ) {
    if (!file) {
      throw new BadRequestException('File upload nakam raha, dobara koshish karein.');
    }

    if (!userId || !title) {
      throw new BadRequestException('UserId aur Title dena zaroori hai.');
    }

    try {
      const result = await this.documentsService.uploadAndSave(file, userId, title);
      return {
        status: 'success',
        message: 'Document successfully uploaded and saved to Nexus.',
        data: result
      };
    } catch (error: any) {
      throw new BadRequestException(`Processing failed: ${error.message}`);
    }
  }

  // 2. Get All Documents for a user
  @Get()
  async getAll(@Req() req) {
    // Postman mein test karne ke liye: /documents?userId=123
    const userId = req.query.userId; 
    if (!userId) {
        throw new BadRequestException('UserId query parameter mein dena zaroori hai.');
    }
    return this.documentsService.findAll(userId);
  }

  // 3. Get Single Document by ID
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  // 4. Delete Document
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.documentsService.delete(id);
      return {
        status: 'success',
        message: 'Document deleted from Nexus and Cloudinary.',
        data: result
      };
    } catch (error: any) {
      throw new BadRequestException(`Deletion failed: ${error.message}`);
    }
  }
}