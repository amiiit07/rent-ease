import { UserRole } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { createAccessToken, hashPassword } from "@/lib/auth";
import { ApiError, fail } from "@/lib/api";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  tenantSlug: z.string().min(2).default("rent-mojo"),
});

export async function POST(req: Request) {
  try {
    const body = registerSchema.parse(await req.json());

    let tenant = await db.tenant.findUnique({ where: { slug: body.tenantSlug } });
    if (!tenant) {
      tenant = await db.tenant.create({
        data: {
          name: "Rent Mojo",
          slug: body.tenantSlug,
        },
      });
    }

    const existingUser = await db.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await hashPassword(body.password);

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: UserRole.CUSTOMER,
        memberships: {
          create: {
            tenantId: tenant.id,
            role: UserRole.CUSTOMER,
          },
        },
      },
    });

    const token = await createAccessToken({
      sub: user.id,
      tenantId: tenant.id,
      role: UserRole.CUSTOMER,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: UserRole.CUSTOMER,
      },
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
      },
    }, { status: 201 });

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
