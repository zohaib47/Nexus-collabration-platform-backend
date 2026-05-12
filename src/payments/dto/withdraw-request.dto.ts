import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class WithdrawRequestDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsNumber()
  @Min(10) // Minimum $10 withdraw kar sakte hain
  amount!: number;

  @IsString()
  @IsNotEmpty()
  bankDetailId!: string; 
}