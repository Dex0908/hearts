import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('skyhearts-admin', '', { maxAge: 0, path: '/' });
  return response;
}
