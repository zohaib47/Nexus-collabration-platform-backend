import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BankDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, default: 'JazzCash' }) 
  provider!: string;

  @Prop({ required: true })
  accountTitle!: string; 

  @Prop({ required: true })
  accountNumber!: string; 
}

export const BankDetailSchema = SchemaFactory.createForClass(BankDetail);