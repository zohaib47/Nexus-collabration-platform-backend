import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true, enum: ['investor', 'entrepreneur'], default: 'entrepreneur' })
  role!: string;

  // Milestone 2: Profiles
  @Prop()
  bio!: string;

  @Prop({ type: [String] })
  skills!: string[];

  // Investment/Startup History (JSON object)
  @Prop({ type: Object })
  history!: {
    projects: string[];
    experienceYears: number;
    investmentBudget?: string;
  };

  @Prop({ default: true })
  isActive!: boolean;

@Prop()
startupHistory!: string;

@Prop()
investmentGoal!: string;

@Prop({ default: Date.now })
createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);