import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentMeta, DocumentSchema } from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocumentMeta.name, schema: DocumentSchema }]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}