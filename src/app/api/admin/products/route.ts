import { ProductCategory, UserRole } from "@prisma/client";
import { z } from "zod";
import { fail, ok, requireAuth } from "@/lib/api";
import { db } from "@/lib/db";

const createProductSchema = z.object({
  name: z.string().min(2),
  category: z.nativeEnum(ProductCategory),
  monthlyRent: z.number().int().positive(),
  securityDeposit: z.number().int().nonnegative(),
  tenureOptions: z.array(z.number().int().positive()).min(1),
  description: z.string().min(10),
});

export async function GET(req: import("next/server").NextRequest) {
  try {
    const auth = await requireAuth(req, [UserRole.ADMIN, UserRole.VENDOR]);

    const products = await db.product.findMany({
      where: { tenantId: auth.tenantId },
      include: {
        inventories: {
          include: {
            serviceArea: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({ products });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: import("next/server").NextRequest) {
  try {
    const auth = await requireAuth(req, [UserRole.ADMIN, UserRole.VENDOR]);
    const body = createProductSchema.parse(await req.json());

    const product = await db.product.create({
      data: {
        tenantId: auth.tenantId,
        name: body.name,
        category: body.category,
        monthlyRent: body.monthlyRent,
        securityDeposit: body.securityDeposit,
        tenureOptions: body.tenureOptions,
        description: body.description,
      },
    });

    return ok({ product }, 201);
  } catch (error) {
    return fail(error);
  }
}
