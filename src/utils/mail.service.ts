import nodemailer from 'nodemailer';

export async function sendEmailTemplate(
  template: string,
  to: string,
  subject: string,
  ...args: any[]
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Użyj odpowiedniego dostawcy
    auth: {
      user: process.env.EMAIL_USER, // Twoje konto e-mail
      pass: process.env.EMAIL_PASS, // Hasło e-mail
    },
  });

  const html = getEmailTemplate(template, ...args);

  try {
    await transporter.sendMail({
      from: '"Your App" <no-reply@example.com>', // Adres nadawcy
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error('Failed to send email', error);
  }
}

function getEmailTemplate(template: string, ...args: any[]): string {
  // Wstaw logikę generowania szablonów e-maili
  return `<p>Your email content based on the ${template} template.</p>`;
}
