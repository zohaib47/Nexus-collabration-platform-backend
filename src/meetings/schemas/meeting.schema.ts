import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hostId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  inviteeId!: Types.ObjectId;

  @Prop({ required: true })
  startTime!: Date;

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
    default: 'PENDING' 
  })
  status!: string;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);