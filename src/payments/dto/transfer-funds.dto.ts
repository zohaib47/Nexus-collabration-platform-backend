import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransferFundsDto {
  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsString()
  @IsNotEmpty()
  recipientId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;
}