import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
  ) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirme seu e-mail - DevBoard',
      html: `
        <h2>Olá, ${name}!</h2>

        <p>
          Obrigado por se cadastrar no DevBoard.
        </p>

        <p>
          Para confirmar seu e-mail, clique no botão abaixo:
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Confirmar e-mail
          </a>
        </p>

        <p>
          Este link é válido por 48 horas.
        </p>

        <p>
          Se você não criou uma conta no DevBoard, ignore este e-mail.
        </p>
      `,
    });
  }
}
