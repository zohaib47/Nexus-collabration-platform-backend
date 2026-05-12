import { Controller, Post, Body, Get, Param, Headers, RawBody, Res, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 1. DEPOSIT (Stripe Intent)
  @Post('create-intent')
  async checkout(@Body() data: CreatePaymentDto) {
    return this.paymentsService.createPaymentIntent(data.userId, data.amount);
  }

  // 2. WITHDRAW (Naya add kiya)
  @Post('withdraw')
  async withdraw(@Body() data: WithdrawRequestDto) {
    // Iska logic service mein banayein (Check balance -> Deduct -> Status Pending)
    return this.paymentsService.createWithdrawal(data.userId, data.amount);
  }

  // 3. TRANSFER (Internal Wallet Transfer - Naya add kiya)
  @Post('transfer')
  async transfer(@Body() data: TransferFundsDto) {
    // Investor to Entrepreneur transfer
    return this.paymentsService.transferFunds(data.senderId, data.recipientId, data.amount);
  }

  // 4. WEBHOOK (For Deposit Confirmation)
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @RawBody() rawBody: Buffer,               
    @Res() res: any
  ) {
    try {
      if (!sig || !rawBody) {
        return res.status(HttpStatus.BAD_REQUEST).send('Missing signature or payload');
      }
      const result = await this.paymentsService.processWebhook(rawBody, sig);
      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      console.error('⚠️ Webhook Logic Error:', error.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
    }
  }

  // 5. HISTORY
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.paymentsService.getHistory(userId);
  }
}