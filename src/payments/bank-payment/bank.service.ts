import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BankDetail } from '../schemas/bank-detail.schema';
import { User } from '../../users/schemas/user.schema'; // User model for balance check
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(BankDetail.name) private bankDetailModel: Model<BankDetail>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  // 1. Save Bank/JazzCash Details
  async addBankDetail(data: any) {
    return await this.bankDetailModel.create(data);
  }

  // 2. Withdrawal Request Logic
  async requestWithdrawal(userId: string, amount: number, bankDetailId: string) {
    const user = await this.userModel.findById(new Types.ObjectId(userId));

    if (!user || user.balance < amount) {
      throw new BadRequestException('Insufficient balance to withdraw.');
    }

    // Deduct balance from wallet
    user.balance -= amount;
    await user.save();

    // Create a "Pending" Transaction for Admin to see
    return await this.transactionModel.create({
      currency: 'usd',
      userId,
      amount,
      type: 'withdrawal',
      status: 'pending', // Admin will manually mark as 'completed'
      metadata: { bankDetailId },
    });
  }
}