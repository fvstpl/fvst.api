import nodemailer from 'nodemailer';
import { createTransport } from "nodemailer";

export async function sendEmailTemplate(
  template: string,
  to: string,
  subject: string,
  ...args: any[]
): Promise<void> {
  const transporter = createTransport({
    host: "smtp.zoho.eu",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = getEmailTemplate(template, ...args);

  try {
    await transporter.sendMail({
      from: '"fvst.pl" <hello@fvst.pl>', // Adres nadawcy
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error('Failed to send email', error);
  }
}

function getEmailTemplate(template: string, ...args: any[]): string {
  return `<p>Your email content based on the ${template} template.</p>`;
}
