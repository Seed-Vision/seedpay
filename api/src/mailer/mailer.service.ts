import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async createTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, // MailHog
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }

  // Envoi de l'email de confirmation d'inscription
  async sendSignupConfirmation(userEmail: string, confirmationUrl: string) {
    const transporter = await this.createTransporter();

    const htmlContent = `
      <html>
        <body>
          <h3>Confirmez votre inscription</h3>
          <p>Bonjour,</p>
          <p>Merci pour votre inscription! Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
          <a href="${confirmationUrl}">Confirmer mon inscription</a>
          <p>Ce lien expire dans une heure.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: 'support@seedpay.com',
      to: userEmail,
      subject: 'Confirmation de l\'inscription',
      html: htmlContent,
    });
  }

  // Envoi de l'email de réinitialisation du mot de passe avec OTP
  async sendPasswordResetOTP(userEmail: string, otp: string) {
    const transporter = await this.createTransporter();

    const htmlContent = `
      <html>
        <body>
          <h3>Réinitialisation de votre mot de passe</h3>
          <p>Bonjour,</p>
          <p>Nous avons reçu une demande pour réinitialiser votre mot de passe.</p>
          <p>Utilisez le code OTP suivant pour procéder : <strong>${otp}</strong></p>
          <p>Ce code expire dans quelques minutes.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: 'support@seedpay.com',
      to: userEmail,
      subject: 'Votre code OTP de réinitialisation',
      html: htmlContent,
    });
  }
}
