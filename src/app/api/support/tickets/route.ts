import { UserRole } from "@prisma/client";
import { z } from "zod";
import { ApiError, fail, ok, requireAuth } from "@/lib/api";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const createTicketSchema = z.object({
  rentalId: z.string().min(1),
  issue: z.string().min(5),
  resolutionEtaHours: z.number().int().positive().max(72).optional(),
});

export async function GET(req: import("next/server").NextRequest) {
  try {
    const auth = await requireAuth(req);

    const tickets = await db.maintenanceTicket.findMany({
      where: {
        tenantId: auth.tenantId,
        ...(auth.role === UserRole.CUSTOMER ? { userId: auth.sub } : {}),
      },
      include: {
        rental: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({ tickets });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: import("next/server").NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body = createTicketSchema.parse(await req.json());

    const rental = await db.rental.findFirst({
      where: {
        id: body.rentalId,
        tenantId: auth.tenantId,
      },
    });

    if (!rental) {
      throw new ApiError(404, "Rental not found");
    }

    if (auth.role === UserRole.CUSTOMER && rental.userId !== auth.sub) {
      throw new ApiError(403, "You can only raise requests for your rentals");
    }

    const ticket = await db.maintenanceTicket.create({
      data: {
        tenantId: auth.tenantId,
        rentalId: rental.id,
        userId: auth.sub,
        issue: body.issue,
        resolutionEtaHours: body.resolutionEtaHours,
      },
    });

    return ok({ ticket }, 201);
  } catch (error) {
    return fail(error);
  }
}
