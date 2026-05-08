import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name lazmi ha' })
  fullName!: string;

  @IsEmail({}, { message: 'Email sahi format mein nahi ha' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password kam az kam 6 characters ka hona chahiye' })
  password!: string;

  @IsEnum(['investor', 'entrepreneur'], { 
    message: 'Role sirf investor ya entrepreneur ho sakta ha' 
  })
  role!: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
