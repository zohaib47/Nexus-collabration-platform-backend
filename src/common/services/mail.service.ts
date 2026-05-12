import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Console logs ko yahan constructor mein rakhein
    console.log('--- Mail Service Init ---');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS ? 'FOUND (Hidden)' : 'NOT FOUND');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: '"Nexus Security" <no-reply@nexus.com>',
        to: email,
        subject: 'Your Security OTP',
        html: `<div style="font-family: Arial;">
                <h2>Nexus Verification</h2>
                <p>Aapka security code hai: <b style="font-size: 20px; color: #d32f2f;">${otp}</b></p>
                <p>Ye code 5 minutes tak valid hai.</p>
               </div>`,
      });
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}