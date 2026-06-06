import { RentalStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ApiError, fail, ok, requireAuth } from "@/lib/api";
import { db } from "@/lib/db";

const createOrderSchema = z.object({
  city: z.string().min(2),
  addressLine: z.string().min(8),
  deliveryDate: z.coerce.date(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        tenureMonths: z.number().int().min(1).max(24),
      }),
    )
    .min(1),
});

function plusMonths(source: Date, months: number) {
  const next = new Date(source);
  next.setMonth(next.getMonth() + months);
  return next;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const body = createOrderSchema.parse(await req.json());

    const products = await db.product.findMany({
      where: {
        id: { in: body.items.map((item) => item.productId) },
        tenantId: auth.tenantId,
        isActive: true,
      },
      include: {
        inventories: {
          include: {
            serviceArea: true,
          },
        },
      },
    });

    if (products.length !== body.items.length) {
      throw new ApiError(400, "One or more products are unavailable");
    }

    const pricedItems = body.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new ApiError(400, "Product not found");
      }

      return {
        product,
        tenureMonths: item.tenureMonths,
        lineRent: product.monthlyRent * item.tenureMonths,
      };
    });

    const totalAmount = pricedItems.reduce((sum, item) => sum + item.lineRent, 0);
    const securityDeposit = pricedItems.reduce((sum, item) => sum + item.product.securityDeposit, 0);

    const result = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          tenantId: auth.tenantId,
          userId: auth.sub,
          city: body.city,
          addressLine: body.addressLine,
          deliveryDate: body.deliveryDate,
          totalAmount,
          securityDeposit,
          items: {
            create: pricedItems.map((item) => ({
              productId: item.product.id,
              tenureMonths: item.tenureMonths,
              monthlyRent: item.product.monthlyRent,
              securityDeposit: item.product.securityDeposit,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of created.items) {
        const sourceProduct = pricedItems.find((entry) => entry.product.id === item.productId)?.product;
        if (!sourceProduct) {
          continue;
        }

        const inventoryTarget = sourceProduct.inventories.find(
          (entry) => entry.serviceArea.city.toLowerCase() === body.city.toLowerCase(),
        );

        if (inventoryTarget) {
          await tx.inventory.update({
            where: { id: inventoryTarget.id },
            data: { unitsReserved: { increment: 1 } },
          });
        }

        await tx.rental.create({
          data: {
            tenantId: auth.tenantId,
            userId: auth.sub,
            productId: item.productId,
            orderItemId: item.id,
            city: body.city,
            status: RentalStatus.SCHEDULED,
            startDate: body.deliveryDate,
            endDate: plusMonths(body.deliveryDate, item.tenureMonths),
          },
        });
      }

      return created;
    });

    return ok(
      {
        orderId: result.id,
        totalAmount,
        securityDeposit,
        items: result.items.length,
      },
      201,
    );
  } catch (error) {
    return fail(error);
  }
}
