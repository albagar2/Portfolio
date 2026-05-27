import { config } from '../config/env.config';
import { logger } from '../config/logger';

// Ya no usamos nodemailer porque Railway bloquea puertos SMTP
// Usaremos la API HTTP de Resend directamente.

export class EmailService {
  /**
   * Envía un correo con los detalles del mensaje de contacto usando Resend API
   */
  static async sendContactMessageEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string | null;
    createdAt?: Date;
  }): Promise<boolean> {
    const adminEmail = 'baciapez@gmail.com'; // El correo verificado en Resend
    // IMPORTANTE: En el plan gratuito de Resend, el 'from' DEBE ser onboarding@resend.dev
    const fromEmail = 'onboarding@resend.dev'; 
    
    // Aquí puedes poner tu key, o cogerla de las variables de entorno si la configuras allí luego
    const resendApiKey = process.env.RESEND_API_KEY || 're_7C9muoLt_MBUuBx3SvBWDiysQd1vPb19p';

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
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email Original:</td>
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
          Este correo fue generado automáticamente desde tu portfolio web a través de la API de Resend.
        </div>
      </div>
    `;

    logger.info(`📬 Procesando envío de email HTTP (Resend) para: ${data.email}`);
    
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: `Portfolio Contact <${fromEmail}>`,
          to: [adminEmail],
          reply_to: data.email,
          subject: subjectText,
          html: htmlContent,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('❌ Error de la API de Resend:', errorData);
        return false;
      }

      logger.info(`✅ Email HTTP (Resend) enviado correctamente a ${adminEmail}`);
      return true;
    } catch (err: any) {
      logger.error('❌ Error de red al contactar con Resend:', { error: err.message, stack: err.stack });
      return false;
    }
  }
}
