import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Pitch extends Document {
    
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  entrepreneurId!: Types.ObjectId;

  @Prop({ required: true })
  startupName!: string;

  @Prop({ required: true })
  industry!: string;

  @Prop({ required: true })
  pitchTitle!: string;

  @Prop({ required: true })
  problemSolved!: string;

  @Prop({ required: true })
  solution!: string;

  @Prop({ required: true })
  fundingGoal!: number;

  @Prop({ required: true })
  equityOffered!: number;

  @Prop()
  videoLink?: string;

  @Prop({ type: [String], default: [] })
  milestones?: string[];

  @Prop()
  teamSize?: string;

  @Prop({ default: 'draft', enum: ['draft', 'published'] })
  status!: string;
}

export const PitchSchema = SchemaFactory.createForClass(Pitch);