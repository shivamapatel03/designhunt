import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'design-hunt-secret-key-12345');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.startsWith('file:') ? undefined : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if ((payload as any).role !== 'SUPER_ADMIN') return null;
    return payload;
  } catch {
    return null;
  }
}

// GET — fetch all settings
export async function GET() {
  const user = await verifySuperAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query('SELECT key, value FROM system_settings');
    const settings: Record<string, string> = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    return NextResponse.json(settings);
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

// POST — update a single setting
export async function POST(req: Request) {
  const user = await verifySuperAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }

    await pool.query(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
    `, [key, value]);

    return NextResponse.json({ success: true, key, value });
  } catch (err) {
    console.error('Settings POST error:', err);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
