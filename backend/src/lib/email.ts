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
      from: `"Designhunt." <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Verify your Designhunt. account", // Subject line
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000; font-weight: 900;">Welcome to Designhunt.!</h1>
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

export async function sendAdminOnboardingEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    const loginUrl = `http://localhost:3000/admin/login`;
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Designhunt. Administrator Credentials",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 40px; border-radius: 20px;">
          <h1 style="color: #000; font-weight: 900; font-style: italic;">WELCOME, ${name.toUpperCase()}!</h1>
          <p style="font-size: 16px; color: #555; font-weight: bold;">YOU HAVE BEEN ADDED AS AN ADMINISTRATOR ON DESIGNHUNT.</p>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 20px;">
            You can now access the staff portal using the credentials below. For security, we recommend changing your password once you log in.
          </p>

          <div style="background: #f4f4f5; border: 2px solid #000; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
            <p style="font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 5px;">Email:</p>
            <p style="font-size: 16px; font-weight: 900; color: #000; margin-bottom: 15px;">${email}</p>
            
            <p style="font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 5px;">Temporary Password:</p>
            <span style="font-size: 24px; font-weight: 900; color: #000; font-family: monospace;">${password}</span>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 18px 36px; font-size: 14px; font-weight: 900; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Go to Staff Portal
            </a>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
            <p style="font-size: 12px; font-weight: 900; color: #000; text-transform: uppercase;">Let's build something great,</p>
            <p style="font-size: 14px; font-weight: 900; color: #000; text-transform: uppercase;">Team Designhunt.</p>
        </div>
      `,
    });


    console.log("Onboarding Email sent: %s", info.messageId);
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
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
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

export async function sendCodeRotationEmail(email: string, newCode: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[ADMIN] Access Code Rotated`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; padding: 40px;">
          <h1 style="color: #000; font-weight: 900; font-size: 24px;">Admin Access Code Rotated</h1>
          <p style="font-size: 16px; color: #555;">The shared access code for the administrator dashboard has been rotated. Use the new code below for future logins.</p>
          <div style="background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 4px; font-family: monospace;">${newCode}</span>
          </div>
          <p style="font-size: 14px; color: #888;">Ensure all relevant team members are notified of this change.</p>
          <p style="font-size: 12px; color: #aaa; margin-top: 20px;">This rotation was triggered by a Super Admin or the system auto-rotation protocol.</p>
        </div>
      `,
    });

    console.log("Rotation Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}
export async function sendIdeaFeedbackEmail(
  email: string,
  userName: string,
  ideaText: string,
  feedback: string,
) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Feedback on your Designhunt. Idea! ✨",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 40px; border-radius: 20px;">
          <h1 style="color: #000; font-weight: 900; font-style: italic;">HI ${userName.toUpperCase()},</h1>
          <p style="font-size: 16px; color: #555; font-weight: bold;">WE'VE REVIEWED YOUR RECENT EXPERIMENT IDEA!</p>
          
          <div style="background: #f4f4f5; border-left: 8px solid #facc15; padding: 20px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #888; text-transform: uppercase;">Your Idea:</p>
            <p style="margin: 10px 0 0 0; font-size: 16px; font-style: italic; font-weight: bold; color: #000;">"${ideaText}"</p>
          </div>

          <p style="font-size: 16px; color: #555; line-height: 1.6;">${feedback}</p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
            <p style="font-size: 12px; font-weight: 900; color: #000; text-transform: uppercase;">Keep designing,</p>
            <p style="font-size: 14px; font-weight: 900; color: #000; text-transform: uppercase;">Team Designhunt.</p>
          </div>
        </div>
      `,
    });

    console.log("Feedback Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your Designhunt. password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 40px; border-radius: 20px;">
          <h1 style="color: #000; font-weight: 900; font-style: italic;">PASSWORD RESET</h1>
          <p style="font-size: 16px; color: #555; font-weight: bold;">WE RECEIVED A REQUEST TO RESET YOUR PASSWORD.</p>
          
          <div style="background: #f4f4f5; border: 2px solid #000; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
            <p style="font-size: 14px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 20px;">Use the code below to reset:</p>
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #000; font-family: monospace;">${token}</span>
          </div>

          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email. This code will expire in 1 hour.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
            <p style="font-size: 12px; font-weight: 900; color: #000; text-transform: uppercase;">Build better,</p>
            <p style="font-size: 14px; font-weight: 900; color: #000; text-transform: uppercase;">Team Designhunt.</p>
          </div>
        </div>
      `,
    });

    console.log("Reset Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}

export async function sendNewsletterEmail(
  email: string,
  subject: string,
  headerImageUrl: string,
  bodyText: string,
  ctaText: string,
  ctaLink: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt. News" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          ${headerImageUrl ? `<img src="${headerImageUrl}" alt="Newsletter Header" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;" />` : ''}
          <h1 style="color: #000; font-weight: 900; font-size: 24px; margin-bottom: 16px;">${subject}</h1>
          
          <div style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 32px; white-space: pre-wrap;">
            ${bodyText}
          </div>

          ${(ctaText && ctaLink) ? `
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${ctaLink}" style="display: inline-block; background-color: #4F39F6; color: #fff; text-decoration: none; padding: 14px 28px; font-size: 16px; font-weight: bold; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
              ${ctaText}
            </a>
          </div>
          ` : ''}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">You are receiving this because you subscribed to Designhunt. updates.</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 4px;">To unsubscribe, reply to this email.</p>
          </div>
        </div>
      `,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error("Newsletter Email Error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Designhunt.! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border: 2px solid #000; border-radius: 16px;">
          <h1 style="color: #000; font-weight: 900; font-size: 28px; margin-bottom: 20px; text-transform: uppercase;">You're on the list!</h1>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6; font-weight: 500;">
            Hey there! 👋
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thanks for subscribing to Designhunt.. You'll now get the latest design insights, resources, and UI trends delivered straight to your inbox.
          </p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin: 30px 0; border-left: 6px solid #4F39F6;">
            <p style="margin: 0; font-size: 15px; font-weight: 700; color: #000;">What to expect:</p>
            <ul style="margin-top: 10px; color: #555; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Weekly design tips & tricks</li>
              <li style="margin-bottom: 8px;">Exclusive UI kits and resources</li>
              <li>Updates on new learning modules</li>
            </ul>
          </div>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We're excited to have you on board! Keep creating amazing things.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
            <p style="font-size: 12px; font-weight: 900; color: #000; text-transform: uppercase;">Stay creative,</p>
            <p style="font-size: 14px; font-weight: 900; color: #000; text-transform: uppercase;">Team Designhunt.</p>
          </div>
        </div>
      `,
    });
    return { success: true, data: info };
  } catch (error) {
    console.error("Welcome Email Error:", error);
    return { success: false, error };
  }
}
