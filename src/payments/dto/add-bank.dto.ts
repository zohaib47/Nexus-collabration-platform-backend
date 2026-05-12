import { IsString, IsNotEmpty, Length, IsEnum, IsMongoId } from 'class-validator';

export class AddBankDto {
  @IsMongoId() 
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  accountTitle!: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 14) 
  accountNumber!: string;

  @IsEnum(['JazzCash', 'EasyPaisa', 'Bank']) 
  provider!: string;
}