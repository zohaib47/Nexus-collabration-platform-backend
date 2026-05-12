import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DocumentMeta extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  fileUrl!: string; // Cloudinary ka secure URL

  @Prop({ required: true })
  cloudinaryId!: string; // Cloudinary ki public_id (file delete ya update karne ke liye zaroori hai)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy!: Types.ObjectId;

  @Prop({ default: 1 })
  version!: number; // Milestone 5: Versioning track karne ke liye

  @Prop({ default: 'PENDING', enum: ['PENDING', 'SIGNED', 'REJECTED'] })
  status!: string;

  @Prop()
  signatureUrl?: string; // E-signature image ka link (optional starting mein)
  
  @Prop()
  fileType?: string; // e.g., 'application/pdf' ya 'image/png'
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentMeta);