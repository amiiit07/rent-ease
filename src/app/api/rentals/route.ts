import { UserRole } from "@prisma/client";
import { fail, ok, requireAuth } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: import("next/server").NextRequest) {
  try {
    const auth = await requireAuth(req);

    const rentals = await db.rental.findMany({
      where: {
        tenantId: auth.tenantId,
        ...(auth.role === UserRole.CUSTOMER ? { userId: auth.sub } : {}),
      },
      include: {
        product: true,
        orderItem: {
          include: {
            order: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({ rentals });
  } catch (error) {
    return fail(error);
  }
}
