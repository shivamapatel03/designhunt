import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password for Gmail
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Design Hunt" <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Verify your Design Hunt account", // Subject line
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000; font-weight: 900;">Welcome to Design Hunt!</h1>
          <p style="font-size: 16px; color: #555;">Use the code below to verify your email address and start your journey.</p>
          <div style="background: #f4f4f5; border: 2px solid #000; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return { success: false, error };
  }
}

export async function sendAdminLoginEmail(
  email: string,
  code: string,
  role: string,
) {
  try {
    const info = await transporter.sendMail({
      from: `"Design Hunt" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[${role}] Login Verification Code`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000; font-weight: 900;">Staff Login Verification</h1>
          <p style="font-size: 16px; color: #555;">You are attempting to login as <strong>${role}</strong>. Use the code below to complete the authentication.</p>
          <div style="background: #f4f4f5; border: 2px solid #000; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
          <p style="font-size: 12px; color: #aaa; margin-top: 20px;">If this wasn't you, please contact the system administrator immediately.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return { success: false, error };
  }
}
