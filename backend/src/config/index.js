require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'colorido2k26_super_secure_jwt_secret_festival_key_rvrjc_2026',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@colorido2k26.com',
  ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Colorido2026!',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.RESEND_FROM || 'COLORIDO 2K26 <onboarding@resend.dev>',
  SMTP: {
    SERVICE: process.env.SMTP_SERVICE || 'gmail',
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.SMTP_PORT || '465', 10),
    SECURE: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM: process.env.EMAIL_FROM || 'COLORIDO 2K26 <onboarding@resend.dev>'
  }
};
