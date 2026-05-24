import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@skyhearts/db';
import { getSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getSession(req.headers.get('cookie'));
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = randomBytes(16).toString('hex');

  await prisma.user.update({
    where: { id: session.userId },
    data: { linkToken: token },
  });

  return NextResponse.json({ success: true, data: { token } });
}
