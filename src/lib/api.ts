import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { readAccessToken } from "@/lib/auth";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function requireAuth(req: NextRequest, allowedRoles?: UserRole[]) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing bearer token");
  }

  const token = authHeader.split(" ")[1];
  const payload = await readAccessToken(token);

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    throw new ApiError(403, "Forbidden");
  }

  return payload;
}
