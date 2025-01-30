import formData from "form-data";
import Mailgun from "mailgun.js";

const API_KEY = process.env.MAILGUN_API_KEY || "your-api-key";
const DOMAIN = process.env.MAILGUN_DOMAIN || "your-domain";
const senderEmail: string= process.env.MAILGUN_SENDER_EMAIL || "your-sender-email";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: API_KEY });

const sendMail = async (
  receiverEmail: string,
  emailSubject: string,
  emailBody: string
): Promise<void> => {
  const data = {
    from: senderEmail,
    to: receiverEmail,
    subject: emailSubject,
    text: emailBody,
  };

  try {
    const response = await mg.messages.create(DOMAIN, data);
    console.log("Email sent successfully:", response);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;
