'use server';

import db from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function completeOnboarding(avatar: string) {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return { error: 'Unauthorized' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
        return { error: 'Invalid token' };
    }

    // Update user
    db.prepare('UPDATE users SET avatar = ?, onboarding_completed = 1 WHERE id = ?')
      .run(avatar, userId);

    // Revalidate paths to update avatar in UI
    revalidatePath('/'); 
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Onboarding Error:', error);
    return { error: 'Failed to update profile' };
  }
}
