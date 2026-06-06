import { UserRole } from "@prisma/client";
import { fail, ok, requireAuth, ApiError } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: import("next/server").NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return fail(new ApiError(503, "Database not configured"));
    }
    const auth = await requireAuth(req, [UserRole.ADMIN, UserRole.VENDOR]);

    const [activeRentals, openTickets, openClaims, ordersCount, inventories, mrr] = await Promise.all([
      db.rental.count({
        where: {
          tenantId: auth.tenantId,
          status: {
            in: ["SCHEDULED", "ACTIVE"],
          },
        },
      }),
      db.maintenanceTicket.count({
        where: {
          tenantId: auth.tenantId,
          status: {
            in: ["OPEN", "IN_REVIEW"],
          },
        },
      }),
      db.damageClaim.count({
        where: {
          tenantId: auth.tenantId,
          status: {
            in: ["OPEN", "UNDER_REVIEW"],
          },
        },
      }),
      db.order.count({ where: { tenantId: auth.tenantId } }),
      db.inventory.findMany({
        where: {
          product: {
            tenantId: auth.tenantId,
          },
        },
        select: {
          unitsTotal: true,
          unitsReserved: true,
        },
      }),
      db.rental.findMany({
        where: {
          tenantId: auth.tenantId,
          status: {
            in: ["SCHEDULED", "ACTIVE"],
          },
        },
        select: {
          product: {
            select: {
              monthlyRent: true,
            },
          },
        },
      }),
    ]);

    const totalUnits = inventories.reduce((sum, item) => sum + item.unitsTotal, 0);
    const reservedUnits = inventories.reduce((sum, item) => sum + item.unitsReserved, 0);
    const utilizationRate = totalUnits ? Math.round((reservedUnits / totalUnits) * 100) : 0;
    const monthlyRecurringRevenue = mrr.reduce((sum, rental) => sum + rental.product.monthlyRent, 0);

    return ok({
      kpis: {
        activeRentals,
        openTickets,
        openClaims,
        ordersCount,
        utilizationRate,
        monthlyRecurringRevenue,
      },
    });
  } catch (error) {
    return fail(error);
  }
}
