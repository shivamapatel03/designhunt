import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Design Hunt <onboarding@resend.dev>', // Use verified domain in production
      to: [email],
      subject: 'Verify your Design Hunt account',
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

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Send Exception:', err);
    return { success: false, error: err };
  }
}

export async function sendAdminLoginEmail(email: string, code: string, role: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Design Hunt <onboarding@resend.dev>',
      to: [email],
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

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Send Exception:', err);
    return { success: false, error: err };
  }
}
