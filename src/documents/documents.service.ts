import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentMeta } from './schemas/document.schema';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentMeta.name) private documentModel: Model<DocumentMeta>,
  ) {}

  // 1. Cloudinary Upload Logic (Multi-format support)
  async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const originalName = file.originalname;
      const fileExtension = originalName.split('.').pop();
      const fileNameWithoutExt = originalName.split('.')[0];

      const isImage = file.mimetype.startsWith('image/');
      const resType = isImage ? 'image' : 'raw';

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'nexus_documents', 
          resource_type: resType,
          public_id: `${fileNameWithoutExt}_${Date.now()}.${fileExtension}`, 
          use_filename: false,
          unique_filename: false,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );
      
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // 2. Metadata Save Logic
  async saveMetadata(userId: string, title: string, fileUrl: string, cloudinaryId: string) {
    const newDoc = new this.documentModel({
      title,
      fileUrl,
      cloudinaryId, 
      uploadedBy: userId,
      status: 'PENDING',
      version: 1
    });
    return await newDoc.save();
  }

  // 3. Combined Method
  async uploadAndSave(file: Express.Multer.File, userId: string, title: string) {
    const uploadResult = await this.uploadToCloudinary(file);
    return await this.saveMetadata(userId, title, uploadResult.secure_url, uploadResult.public_id);
  }

  // 4. Sab documents ki list lana (Sorted by newest first)
  async findAll(userId: string) {
    return await this.documentModel.find({ uploadedBy: userId }).sort({ createdAt: -1 });
  }

  // 5. Ek specific document dhoondna
  async findOne(id: string) {
    const doc = await this.documentModel.findById(id);
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // 6. Delete Logic (DB aur Cloudinary dono se)
  async delete(id: string) {
    const doc = await this.documentModel.findById(id);
    if (!doc) throw new NotFoundException('Document not found');

    // Check karein ke file image hai ya raw taakay sahi se delete ho
    const isImage = doc.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i);
    const resourceType = isImage ? 'image' : 'raw';

    // Cloudinary se urana
    await cloudinary.uploader.destroy(doc.cloudinaryId, { resource_type: resourceType });

    // MongoDB se urana
    return await this.documentModel.findByIdAndDelete(id);
  }
}