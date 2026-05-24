import { SignJWT, jwtVerify } from 'jose';

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'skyhearts-admin-secret-change-in-production'
);

export interface AdminJWTPayload {
  adminId: string;
  username: string;
}

export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(ADMIN_SECRET);
}

export async function verifyAdminToken(
  token: string
): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(
  cookieHeader: string | null
): Promise<AdminJWTPayload | null> {
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const idx = c.indexOf('=');
      return [c.slice(0, idx), c.slice(idx + 1)];
    })
  );
  const token = cookies['skyhearts-admin'];
  if (!token) return null;
  return verifyAdminToken(token);
}
