import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
  ) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await this.resend.emails.send({
      from: 'DevBoard <onboarding@resend.dev>',
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
