import { Controller, Post, Body } from '@nestjs/common';
import { BankService } from './bank.service';

@Controller('payments/bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('add-account')
  async addAccount(@Body() data: any) {
    console.log('Received Bank Detail Data:', data);
    return this.bankService.addBankDetail(data);
  }

  @Post('withdraw')
  async withdraw(@Body() data: { userId: string, amount: number, bankDetailId: string }) {
    return this.bankService.requestWithdrawal(data.userId, data.amount, data.bankDetailId);
  }
}