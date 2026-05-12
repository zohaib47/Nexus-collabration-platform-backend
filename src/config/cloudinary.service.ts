import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'nexus_documents' },
      (error, result) => {
        if (error) return reject(error);
        
        if (!result) {
          return reject(new Error('Cloudinary upload result is undefined'));
        }
        
        resolve(result);
      },
    );
    upload.end(file.buffer);
  });
}
}