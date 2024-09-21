import nodemailer, { createTransport } from 'nodemailer';

export async function sendEmailTemplate(
  template: string,
  to: string,
  subject: string,
  ...args: any[]
): Promise<void> {
  const transporter = createTransport({
    host: 'smtp.zoho.eu',
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
  switch (template) {
    case 'reset':
      return getResetPasswordTemplate(args[0]); // args[0] to token resetu
    case 'welcome':
      return getWelcomeTemplate();
    case 'login':
      return getLoginTemplate(args[0]);
    default:
      return '<p>Invalid template name.</p>';
  }
}

function getResetPasswordTemplate(token: string): string {
  // Dodajemy domenę fvst.pl do linku resetowania hasła
  const resetLink = `https://fvst.pl/reset-password?token=${token}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resetowanie hasła</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #000000;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
            position: relative;
        }
        .header .profile {
            width: 60px;
            height: 60px;
            background-color: #ffffff;
            color: #000000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            border: 3px solid #000000;
            margin: 0 auto;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
        }
        .main-content {
            padding: 20px;
            color: #000000;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: #ffffff;
            background-color: #000000;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #ffffff;
            color: #000000;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="profile">F</div>
            <h1>Resetowanie hasła</h1>
        </div>
        <div class="main-content">
            <p>Cześć!</p>
            <p>Otrzymałeś ten e-mail, ponieważ poprosiłeś o zresetowanie hasła.</p>
            <p>Aby zresetować hasło, kliknij poniższy przycisk:</p>
            <a href="${resetLink}" class="button">Zresetuj hasło</a>
            <p>Jeśli nie zlecałeś resetowania hasła, zignoruj tę wiadomość.</p>
        </div>
        <div class="footer">
            <p>© 2024 fvst. Wszelkie prawa zastrzeżone.</p>
            <p>Skontaktuj się z nami pod adresem <a href="mailto:hello@fvst.pl" style="color: #000000;">hello@fvst.pl</a></p>
        </div>
    </div>
</body>
</html>

  `;
}

function getWelcomeTemplate(): string {
  return `
 <!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witamy w fvst</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #000000;
        }
        p {
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Witamy w fvst.pl!</h1>
    <p>Cześć,</p>
    <p>Aby zalogować się do swojego konta, kliknij poniższy link:</p>
    <a href="https://fvst.pl/login" class="button">Zaloguj się</a>
    <p>Jeśli nie rejestrowałeś się, zignoruj tę wiadomość.</p>
    <p>Z pozdrowieniami,<br>Zespół fvst.pl</p>
    <div class="footer">
      <p>&copy; 2024 fvst.pl. Wszystkie prawa zastrzeżone.</p>
    </div>
  </div>
  </body>
  </html>

  `;
}
function getLoginTemplate(email: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logowanie do fvst</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #000000;
          padding: 20px;
          margin: 0;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
          color: #000000;
      }
      p {
          line-height: 1.6;
      }
      .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #999;
          text-align: center;
      }
  </style>
</head>
<body>
<div class="container">
  <h1>Logowanie do fvst.pl</h1>
  <p>Cześć, ${email},</p>
  <p>Oto link do logowania do Twojego konta:</p>
  <a href="https://fvst.pl/login" class="button">Zaloguj się</a>
  <p>Jeśli nie rejestrowałeś się, zignoruj tę wiadomość.</p>
  <p>Z pozdrowieniami,<br>Zespół fvst.pl</p>
  <div class="footer">
    <p>&copy; 2024 fvst.pl. Wszystkie prawa zastrzeżone.</p>
  </div>
</div>
</body>
</html>`;
}
function getFooter(): string {
  return `
  <footer style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
    <p style="font-size: 12px; color: #888;">fvst.pl - Wszystkie prawa zastrzeżone</p>
    <div style="display: flex; justify-content: center; margin-top: 10px;">
      <a href="https://discord.com/invite/fvst" style="margin: 0 10px;"><img src="https://fvst.pl/icons/discord.png" alt="Discord" width="24"></a>
      <a href="https://twitter.com/fvst" style="margin: 0 10px;"><img src="https://fvst.pl/icons/twitter.png" alt="Twitter" width="24"></a>
      <a href="https://facebook.com/fvst" style="margin: 0 10px;"><img src="https://fvst.pl/icons/facebook.png" alt="Facebook" width="24"></a>
      <a href="https://instagram.com/fvst" style="margin: 0 10px;"><img src="https://fvst.pl/icons/instagram.png" alt="Instagram" width="24"></a>
    </div>
  </footer>
  `;
}
