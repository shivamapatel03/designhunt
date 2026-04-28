import nodemailer from "nodemailer";

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
          <h1 style="color: #000; font-weight: 900;">Welcome to Designhunt. !</h1>
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

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Designhunt. ! 🎉",
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #eaeaea;">
          <!-- Banner Image -->
          <div style="width: 100%; height: 220px; background-color: #000; overflow: hidden; position: relative;">
            <img src="https://images.unsplash.com/photo-1777028456884-64411a901e97?q=80&w=2320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Designhunt. Welcome" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />
            <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 8px 16px; border-radius: 8px;">
              <span style="color: white; font-weight: 800; font-size: 18px; letter-spacing: 1px;">Designhunt.</span>
            </div>
          </div>
          
          <div style="padding: 40px; text-align: center;">
            <h1 style="color: #111; font-weight: 900; font-size: 28px; margin-bottom: 16px; letter-spacing: -0.5px;">Welcome, ${name}!</h1>
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 32px;">
              We're thrilled to have you join our community. Get ready to explore the best design resources, theory, and challenges.
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              Explore Your Dashboard
            </a>
          </div>
          
          <div style="background: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="font-size: 13px; color: #888; margin: 0;">
              <strong>Designhunt.</strong><br/>
              Inspiring the next generation of designers.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Welcome Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeBackEmail(email: string, name: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Designhunt." <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome back to Designhunt. ! 🚀",
      html: `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #eaeaea;">
          <!-- Banner Image -->
          <div style="width: 100%; height: 220px; background-color: #000; overflow: hidden; position: relative;">
            <img src="https://images.unsplash.com/photo-1777028456884-64411a901e97?q=80&w=2320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Designhunt. Welcome Back" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />
            <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 8px 16px; border-radius: 8px;">
              <span style="color: white; font-weight: 800; font-size: 18px; letter-spacing: 1px;">Designhunt.</span>
            </div>
          </div>
          
          <div style="padding: 40px; text-align: center;">
            <h1 style="color: #111; font-weight: 900; font-size: 28px; margin-bottom: 16px; letter-spacing: -0.5px;">Welcome back, ${name}!</h1>
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 32px;">
              It's great to see you again! We've added some exciting new resources and challenges since your last visit. Dive in and keep leveling up your skills.
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              Jump Back In
            </a>
          </div>
          
          <div style="background: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="font-size: 13px; color: #888; margin: 0;">
              <strong>Designhunt.</strong><br/>
              Inspiring the next generation of designers.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Welcome Back Email sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}
