import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    const requests = db.prepare('SELECT * FROM tutor_requests ORDER BY created_at DESC').all();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const { id, action } = await req.json(); // action: 'APPROVE' or 'DECLINE'

        if (action === 'APPROVE') {
            const request = db.prepare('SELECT user_id FROM tutor_requests WHERE id = ?').get(id) as { user_id: string };
            
            // Generate Random Password
            const rawPassword = randomBytes(4).toString('hex'); // 8 char hex string
            const hashedPassword = await hash(rawPassword, 10);

            // Transaction: Update request status AND user role AND password
            const updateRequest = db.prepare('UPDATE tutor_requests SET status = ? WHERE id = ?');
            const updateUser = db.prepare('UPDATE users SET role = ?, password = ? WHERE id = ?');
            
            const transaction = db.transaction(() => {
                updateRequest.run('APPROVED', id);
                updateUser.run('TUTOR', hashedPassword, request.user_id);
            });
            
            transaction();

            return NextResponse.json({ success: true, generatedPassword: rawPassword });
        } else {
            db.prepare('UPDATE tutor_requests SET status = ? WHERE id = ?').run('DECLINED', id);
            return NextResponse.json({ success: true });
        }
        
    } catch (error) {
        console.error('Admin Tutor Action Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
