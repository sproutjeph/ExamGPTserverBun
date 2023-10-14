import nodeMailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_MAIL = process.env.SMTP_MAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_SERVER = process.env.SMTP_SERVER;

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    service: SMTP_SERVER,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../mails", template);

  //Render the email template with ejs
  const html: string = await ejs.renderFile(templatePath, data);

  const emailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
