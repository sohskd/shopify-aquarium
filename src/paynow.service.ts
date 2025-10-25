import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class PayNowService {
  // Your business UEN or mobile number for PayNow
  // TODO: Replace with your actual UEN
  private readonly uen = '202012345K'; // Replace with your UEN
  private readonly entityName = 'AQUATIC AVENUE';

  /**
   * Generate PayNow QR Code
   * @param amount - Amount in SGD
   * @param reference - Unique order reference
   * @returns QR code as base64 data URL
   */
  async generatePayNowQR(amount: number, reference: string): Promise<string> {
    try {
      // PayNow QR Code Format (EMVCo Specification)
      const payNowString = this.buildPayNowString(amount, reference);
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(payNowString, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 400,
        margin: 2,
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('[PayNow] QR generation error:', error);
      throw new Error('Failed to generate PayNow QR code');
    }
  }

  /**
   * Build PayNow string according to EMVCo specification
   */
  private buildPayNowString(amount: number, reference: string): string {
    const formattedAmount = amount.toFixed(2);
    
    // PayNow EMVCo format
    // Format: [ID][Length][Value]
    const payload = [
      '00', '02', '01',                           // Payload Format Indicator
      '01', '02', '12',                           // Point of Initiation Method (12 = static)
      '26',                                       // Merchant Account Information
      this.formatField('0009', 'SG.PAYNOW'),     // PayNow identifier
      this.formatField('0101', '2'),             // Proxy Type (2 = UEN)
      this.formatField('0210', this.uen),        // Proxy Value (UEN)
      this.formatField('0303', reference),       // Transaction Reference
      '52', '04', '0000',                        // Merchant Category Code
      '53', '03', '702',                         // Transaction Currency (702 = SGD)
      '54', String(formattedAmount.length).padStart(2, '0'), formattedAmount, // Amount
      '58', '02', 'SG',                          // Country Code
      '59', String(this.entityName.length).padStart(2, '0'), this.entityName, // Merchant Name
      '60', '09', 'Singapore',                   // Merchant City
      '62', '07', '0503', '***',                 // Additional Data (Bill Number)
    ].join('');

    // Calculate CRC
    const crc = this.calculateCRC(payload + '6304');
    
    return payload + '63' + '04' + crc;
  }

  /**
   * Format field according to EMVCo TLV format
   */
  private formatField(id: string, value: string): string {
    const length = String(value.length).padStart(2, '0');
    return id + length + value;
  }

  /**
   * Calculate CRC-16/CCITT-FALSE checksum
   */
  private calculateCRC(data: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
      }
    }

    crc = crc & 0xFFFF;
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * Generate unique order reference
   */
  generateOrderReference(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `AA${timestamp}${random}`;
  }

  /**
   * FOR TESTING: Generate QR from custom PayNow string
   * Use this if you have a specific PayNow string to test
   */
  async generateCustomQR(payNowString: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(payNowString, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 400,
        margin: 2,
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('[PayNow] Custom QR generation error:', error);
      throw new Error('Failed to generate custom QR code');
    }
  }
}
