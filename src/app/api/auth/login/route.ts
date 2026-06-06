import { z } from "zod";
import { NextResponse } from "next/server";
import { createAccessToken, verifyPassword } from "@/lib/auth";
import { ApiError, fail } from "@/lib/api";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tenantSlug: z.string().min(2).default("rent-mojo"),
  purpose: z.enum(["user", "admin"]).default("user"),
});

export async function POST(req: Request) {
  try {
    const body = loginSchema.parse(await req.json());

    const tenant = await db.tenant.findUnique({ where: { slug: body.tenantSlug } });
    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    const user = await db.user.findUnique({
      where: { email: body.email },
      include: {
        memberships: {
          where: {
            tenantId: tenant.id,
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const match = await verifyPassword(body.password, user.passwordHash);
    if (!match) {
      throw new ApiError(401, "Invalid credentials");
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new ApiError(403, "User does not belong to this tenant");
    }

    if (body.purpose === "admin" && membership.role !== "ADMIN") {
      throw new ApiError(403, "Admin login required");
    }

    if (body.purpose === "user" && membership.role === "ADMIN") {
      throw new ApiError(403, "Use the admin login page");
    }

    const token = await createAccessToken({
      sub: user.id,
      tenantId: tenant.id,
      role: membership.role,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: membership.role,
      },
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
      },
    });

    response.cookies.set("rent-mojo-token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return fail(error);
  }
}
