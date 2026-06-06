import { ProductCategory } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenantSlug") ?? "rent-mojo";
    const category = searchParams.get("category") as ProductCategory | null;
    const city = searchParams.get("city");

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true, name: true, slug: true },
    });

    if (!tenant) {
      return ok({ products: [] });
    }

    const products = await db.product.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
        ...(category ? { category } : {}),
      },
      include: {
        inventories: {
          include: {
            serviceArea: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = products.map((product) => {
      const relevantInventory = city
        ? product.inventories.filter((entry) => entry.serviceArea.city.toLowerCase() === city.toLowerCase())
        : product.inventories;

      const availableUnits = relevantInventory.reduce(
        (sum, entry) => sum + Math.max(0, entry.unitsTotal - entry.unitsReserved),
        0,
      );

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        tenureOptions: product.tenureOptions,
        availableUnits,
      };
    });

    return ok({ tenant, products: payload });
  } catch (error) {
    return fail(error);
  }
}
