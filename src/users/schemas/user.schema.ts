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

  @Prop()
  bio!: string;

  @Prop({ type: [String] })
  skills!: string[];

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

  @Prop({ default: 0 })
  balance!: number;

  @Prop({ default: 'USD' })
  currency!: string;

  // --- Milestone 7: Security Fields ---
  
  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ type: String, default: null })
  otp!: string | null;

  @Prop({ type: Date, default: null })
  otpExpires!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);