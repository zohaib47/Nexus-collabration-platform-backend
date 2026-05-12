import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  recipientId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true ,  default: 'pkr' })
  currency!: string; // e.g., 'usd'

  @Prop({ required: true })
  type!: string; // 'deposit', 'withdraw', 'transfer'

  @Prop({ default: 'pending' })
  status!: string; // 'pending', 'completed', 'failed'

  @Prop()
  stripePaymentIntentId!: string; // Stripe ka reference ID

  @Prop({ type: Object })
  metadata!: any; // Extra info (e.g., kis project ke liye investment hai)
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);