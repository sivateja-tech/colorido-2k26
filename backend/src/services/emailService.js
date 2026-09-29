const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

/**
 * Get or initialize nodemailer transporter
 */
function getTransporter() {
  if (!transporter) {
    if (config.SMTP.SERVICE === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.SMTP.USER,
          pass: config.SMTP.PASS
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: config.SMTP.HOST,
        port: config.SMTP.PORT,
        secure: config.SMTP.SECURE,
        auth: {
          user: config.SMTP.USER,
          pass: config.SMTP.PASS
        }
      });
    }
  }
  return transporter;
}

/**
 * Send password reset email
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.resetUrl - Relative or full password reset URL
 * @param {string} [options.name] - Recipient name
 */
async function sendPasswordResetEmail({ to, resetUrl, name = 'Participant' }) {
  try {
    const transport = getTransporter();
    const fullResetUrl = resetUrl.startsWith('http')
      ? resetUrl
      : `${config.FRONTEND_URL}${resetUrl}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your COLORIDO 2K26 Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #08090e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background: linear-gradient(180deg, #111422 0%, #0d0f1a 100%); border-radius: 24px; border: 1px solid rgba(139, 92, 246, 0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                COLORIDO <span style="color: #a855f7;">2K26</span>
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8;">
                R V R &amp; J C College of Engineering
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 10px 36px 30px 36px;">
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 28px;">
                <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #f8fafc;">
                  Password Reset Request
                </h2>
                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  Hello <strong style="color: #ffffff;">${name}</strong>,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                  We received a request to reset your password for your COLORIDO 2K26 account. Click the button below to choose a new password:
                </p>

                <!-- Button -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                  <tr>
                    <td align="center">
                      <a href="${fullResetUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 14px; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); text-decoration: none; border-radius: 14px; box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.5); letter-spacing: 0.3px;">
                        Reset My Password &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 24px 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="margin: 0 0 20px 0; font-size: 11px; word-break: break-all; color: #a855f7; background-color: rgba(168, 85, 247, 0.08); padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(168, 85, 247, 0.2);">
                  ${fullResetUrl}
                </p>

                <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; margin-top: 20px;">
                  <p style="margin: 0 0 6px 0; font-size: 12px; color: #f59e0b; font-weight: 600;">
                    &#9201; Security Notice:
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                    This password reset link will expire in <strong>20 minutes</strong>. If you did not request a password reset, you can safely ignore this message; your password will remain secure.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 36px 32px 36px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 16px 0 4px 0; font-size: 11px; color: #64748b;">
                COLORIDO 2K26 &bull; National Cultural, Sports &amp; Technical Festival
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                R V R &amp; J C College of Engineering &bull; Chandramoulipuram, Chowdavaram, Guntur, AP - 522019
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const mailOptions = {
      from: config.SMTP.FROM,
      to,
      subject: 'COLORIDO 2K26 — Password Reset Request',
      text: `Hello ${name},\n\nYou requested to reset your password for COLORIDO 2K26.\n\nPlease use the following link to reset your password:\n${fullResetUrl}\n\nThis link will expire in 20 minutes.\n\nIf you did not make this request, you can safely ignore this email.`,
      html: htmlContent
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`[EMAIL] Password reset email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send password reset email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
  getTransporter
};
