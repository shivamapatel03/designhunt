import { Resend } from 'resend';

// Only initialize if key is present, otherwise we'll throw on use
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAdminLoginEmail(email: string, password: string, role: string = 'ADMIN') {
    if (!resend) {
        console.error('RESEND_API_KEY is missing. Email skipped.');
        if (process.env.NODE_ENV !== 'production') {
            console.log(`--- [${role}] DEVELOPMENT MOCK EMAIL ---`);
            console.log(`To: ${email}`);
            console.log(`Verification Code: ${password}`);
            console.log('------------------------------');
            return { success: true, mocked: true };
        }
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Design Hunt <onboarding@resend.dev>';
        
        const roleLabels: Record<string, { title: string, sub: string, color: string }> = {
            'TUTOR': { title: 'Instructor Hub', sub: 'Creator Security Verification', color: '#6366f1' },
            'ADMIN': { title: 'Admin Console', sub: 'Staff Security Verification', color: '#000000' },
            'SUPER_ADMIN': { title: 'Super Admin', sub: 'Terminal Access Verification', color: '#ef4444' }
        };

        const config = roleLabels[role] || roleLabels['ADMIN'];
        
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: `[${config.title}] Your Security Code`,
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 40px; background: #ffffff; border: 4px solid #000000; border-radius: 32px; max-width: 500px; margin: auto; box-shadow: 8px 8px 0px 0px #000000;">
                    <div style="background: ${config.color}; width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: white; font-size: 32px; text-align: center; line-height: 60px;">
                        ${role === 'TUTOR' ? '🎨' : role === 'SUPER_ADMIN' ? '🔑' : '🛡️'}
                    </div>
                    <h1 style="text-transform: uppercase; font-weight: 900; font-size: 32px; letter-spacing: -1.5px; margin-bottom: 8px; color: #000000; line-height: 1;">${config.title}</h1>
                    <p style="font-weight: 700; color: ${config.color}; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 32px;">${config.sub}</p>
                    
                    <p style="font-weight: 500; color: #64748b; margin-bottom: 24px; font-size: 16px;">High-security access requested. Use the code below to proceed.</p>

                    <div style="background: #f8fafc; padding: 32px; font-family: 'JetBrains Mono', monospace; font-size: 48px; font-weight: 900; text-align: center; border: 3px solid #000000; border-radius: 24px; color: #000000; letter-spacing: 8px;">
                        ${password}
                    </div>
                    
                    <p style="font-size: 13px; color: #94a3b8; margin-top: 32px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Expires in 10 minutes. If this wasn't you, secure your account immediately.
                    </p>
                </div>
            `,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Email Send Error:', error);
        
        // Final fallback for development: log to console so user isn't blocked
        if (process.env.NODE_ENV !== 'production') {
            console.log('--- DEVELOPMENT FALLBACK (API FAILED) ---');
            console.log(`To: ${email}`);
            console.log(`Verification Code: ${password}`);
            console.log('-----------------------------------------');
            return { success: true, error, mocked: true };
        }
        
        return { success: false, error };
    }
}
