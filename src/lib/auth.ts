import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

export type AuthTokenPayload = {
  sub: string;
  tenantId: string;
  role: UserRole;
};

function getJwtSecret() {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error("JWT_SECRET is required");
  }

  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAccessToken(payload: AuthTokenPayload) {
  return new SignJWT({ role: payload.role, tenantId: payload.tenantId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function readAccessToken(token: string): Promise<AuthTokenPayload> {
  const verified = await jwtVerify(token, getJwtSecret());
  const role = verified.payload.role;
  const tenantId = verified.payload.tenantId;
  const sub = verified.payload.sub;

  if (!sub || !tenantId || !role) {
    throw new Error("Invalid token payload");
  }

  return {
    sub,
    tenantId: String(tenantId),
    role: role as UserRole,
  };
}
