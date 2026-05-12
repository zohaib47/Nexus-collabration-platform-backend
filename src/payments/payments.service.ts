import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { User } from '../users/schemas/user.schema'; 
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe.Stripe;

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(User.name) private userModel: Model<User>, 
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // apiVersion: '2025-01-24' as any,
    });
  }

  // 1. Create Payment Intent (Deposit)
  async createPaymentIntent(userId: string, amount: number) {
    try {
      const session = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { userId },
      });

      return await this.transactionModel.create({
        userId,
        amount,
        currency: 'usd',
        type: 'deposit',
        status: 'pending',
        stripePaymentIntentId: session.id,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Stripe Error';
      throw new Error(`Stripe Error: ${msg}`);
    }
  }

  // 2. Webhook Process (Status update + Wallet Balance)
  async processWebhook(rawBody: Buffer, sig: string) {
    let event: any;

    try {
      // event = this.stripe.webhooks.constructEvent(
      //   rawBody,
      //   sig,
      //   process.env.STRIPE_WEBHOOK_SECRET!
      // );
      
    event = JSON.parse(rawBody.toString());
    
    console.log("Event Received Successfully:", event.type);

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Webhook Error';
      throw new Error(`Webhook Error: ${msg}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log("Stripe Se Aane Wali ID:", paymentIntent.id);
      const userId = paymentIntent.metadata.userId;
      const stripeId = paymentIntent.id;
      const amountReceived = paymentIntent.amount / 100;

     const transaction = await this.transactionModel.findOneAndUpdate(
        { stripePaymentIntentId: stripeId },
        { status: 'completed' }
      );
     console.log("DB Mein Mili Transaction:", transaction);
     
      await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { balance: amountReceived } }
      );

      console.log(`✅ $${amountReceived} confirmed for User: ${userId}`);
    }
    
    return { received: true };
  }
// 3. Internal Transfer (Investor to Entrepreneur)
  async transferFunds(fromUserId: string, toUserId: string, amount: number) {

    console.log("--- Transfer Debug Start ---");
  console.log("From User ID (Sender):", fromUserId);
  console.log("To User ID (Recipient):", toUserId);
  console.log("Amount to Transfer:", amount);

    const sender = await this.userModel.findById(fromUserId);
    
    if (!sender || sender.balance < amount) {
      throw new BadRequestException('Insufficient balance for this transfer.');
    }

    // Sender se katlo, Receiver ko dedo
    await this.userModel.findByIdAndUpdate(fromUserId, { $inc: { balance: -amount } });
    await this.userModel.findByIdAndUpdate(toUserId, { $inc: { balance: amount } });

    // Transaction record create karo (Recipient ID ke saath)
    return await this.transactionModel.create({
      userId: fromUserId,
      recipientId: toUserId, // Schema mein recipientId field hona lazmi hai
      amount,
      currency: 'usd',
      type: 'transfer',
      status: 'completed',
    });
  }

  // 4. Withdrawal Logic (Mock) - NAYA ADD KIYA
  async createWithdrawal(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user || user.balance < amount) {
      throw new BadRequestException('Inadequate funds for withdrawal.');
    }

    // Balance foran deduct karo taake user double spend na kare
    await this.userModel.findByIdAndUpdate(userId, { $inc: { balance: -amount } });

    return await this.transactionModel.create({
      userId,
      amount,
      currency: 'usd',
      type: 'withdraw',
      status: 'pending', 
    });
  }

  // 5. Improved History (with both sent and received transactions)
  async getHistory(userId: string) {
    return await this.transactionModel.find({
      $or: [
        { userId: userId },      
        { recipientId: userId }  
      ]
    }).sort({ createdAt: -1 });
  }
}