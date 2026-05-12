import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  /**
   * 6-digit random number generate karega
   */
  generateOtp(): string {
    // 100000 se 999999 ke darmiyan number
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check karega ke OTP expire toh nahi hua
   * @param expiryDate Database se ayi hui expiry date
   */
  isOtpExpired(expiryDate: Date): boolean {
    const now = new Date();
    return now > expiryDate;
  }

  /**
   * OTP ki expiry time generate karega (e.g., 5 minutes)
   */
  getExpiryTime(minutes: number = 5): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}