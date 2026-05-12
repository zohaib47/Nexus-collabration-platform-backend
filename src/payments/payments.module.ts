import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; 
import { BankController } from './bank-payment/bank.controller';
import { BankService } from './bank-payment/bank.service';
import { BankDetail, BankDetailSchema } from './schemas/bank-detail.schema';

@Module({
  imports: [
    // Dono schemas register karna zaroori hain
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
      { name: BankDetail!.name, schema: BankDetailSchema },
    ]),
  ],
  controllers: [PaymentsController, BankController],
  providers: [PaymentsService, BankService],
  exports: [PaymentsService, BankService], 
})
export class PaymentsModule {}