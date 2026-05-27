import nodemailer from 'nodemailer';
import dns from 'dns';
import { config } from '../config/env.config';
import { logger } from '../config/logger';

// Fuerza a Node.js a preferir IPv4 sobre IPv6. 
// Soluciona el error ENETUNREACH en contenedores (como Railway) que no tienen enrutamiento IPv6 completo.
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
      logger.warn('⚠️ SMTP variables (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured. Email sending is disabled.');
      return null;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465, // true para puerto 465, false para otros
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });
      logger.info('📧 Nodemailer SMTP transporter inicializado correctamente.');
      return this.transporter;
    } catch (err: any) {
      logger.error('❌ Error al inicializar el transportador Nodemailer SMTP:', { error: err.message });
      return null;
    }
  }

  /**
   * Envía un correo con los detalles del mensaje de contacto
   */
  static async sendContactMessageEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string | null;
    createdAt?: Date;
  }): Promise<boolean> {
    const adminEmail = config.ADMIN_EMAIL || 'albagarcialopez39@gmail.com';
    const fromEmail = config.SMTP_FROM || config.SMTP_USER || 'no-reply@portfolio.dev';

    const subjectText = `[Portfolio] Nuevo mensaje de ${data.name}: ${data.subject}`;
    const dateFormatted = data.createdAt ? new Date(data.createdAt).toLocaleString('es-ES') : new Date().toLocaleString('es-ES');
    const ipStr = data.ipAddress || 'Desconocida';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;">
        <h2 style="color: #FFB800; border-bottom: 2px solid #FFB800; padding-bottom: 10px; margin-top: 0; font-style: italic; text-transform: uppercase;">Nuevo Mensaje de Contacto</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">Remitente:</td>
            <td style="padding: 8px 0; color: #222;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0; color: #222;"><a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Asunto:</td>
            <td style="padding: 8px 0; color: #222; font-weight: 500;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Fecha:</td>
            <td style="padding: 8px 0; color: #666; font-size: 0.9em;">${dateFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Dirección IP:</td>
            <td style="padding: 8px 0; color: #666; font-size: 0.9em; font-family: monospace;">${ipStr}</td>
          </tr>
        </table>
        
        <div style="background-color: #ffffff; border-left: 4px solid #FFB800; padding: 15px; border-radius: 4px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.1em; color: #333;">Mensaje:</h3>
          <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 0.8em; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px;">
          Este correo fue generado automáticamente desde tu portfolio web.
        </div>
      </div>
    `;

    const textContent = `
      NUEVO MENSAJE DE CONTACTO (PORTFOLIO)
      ====================================
      Remitente: ${data.name}
      Email: ${data.email}
      Asunto: ${data.subject}
      Fecha: ${dateFormatted}
      IP: ${ipStr}
      
      Mensaje:
      ------------------------------------
      ${data.message}
    `;

    logger.info(`📬 Procesando envío de email para mensaje de contacto de: ${data.email}`);
    
    const transporter = this.getTransporter();
    if (!transporter) {
      logger.warn('📧 Email no enviado a través de SMTP (SMTP no configurado). Se registra el mensaje en consola:');
      logger.info(`[SMTP SIMULADO] DESTINATARIO: ${adminEmail}\nASUNTO: ${subjectText}\nCONTENIDO:\n${textContent}`);
      return false;
    }

    try {
      await transporter.sendMail({
        from: `"${data.name} (Portfolio)" <${fromEmail}>`,
        to: adminEmail,
        replyTo: data.email,
        subject: subjectText,
        text: textContent,
        html: htmlContent,
      });
      logger.info(`✅ Email de contacto enviado correctamente a ${adminEmail}`);
      return true;
    } catch (err: any) {
      logger.error('❌ Error al enviar el email de contacto a través de SMTP:', { error: err.message, stack: err.stack });
      return false;
    }
  }
}
