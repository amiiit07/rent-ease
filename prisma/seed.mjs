import { PrismaClient, ProductCategory, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "rent-mojo" },
    update: { name: "Rent Mojo" },
    create: {
      slug: "rent-mojo",
      name: "Rent Mojo",
    },
  });

  const cities = [
    { city: "Bengaluru", zoneName: "Tech Parks" },
    { city: "Hyderabad", zoneName: "Madhapur" },
    { city: "Pune", zoneName: "Hinjawadi" },
    { city: "Noida", zoneName: "Sector 62" },
  ];

  for (const area of cities) {
    await prisma.serviceArea.upsert({
      where: {
        tenantId_city: {
          tenantId: tenant.id,
          city: area.city,
        },
      },
      update: {
        city: area.city,
        zoneName: area.zoneName,
      },
      create: {
        tenantId: tenant.id,
        city: area.city,
        zoneName: area.zoneName,
      },
    });
  }

  const adminHash = await bcrypt.hash("Admin@1234", 10);
  const vendorHash = await bcrypt.hash("Vendor@1234", 10);
  const customerHash = await bcrypt.hash("Customer@1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rentmojo.com" },
    update: { name: "Platform Admin", role: UserRole.ADMIN, passwordHash: adminHash },
    create: {
      name: "Platform Admin",
      email: "admin@rentmojo.com",
      role: UserRole.ADMIN,
      passwordHash: adminHash,
    },
  });

  const vendor = await prisma.user.upsert({
    where: { email: "vendor@rentmojo.com" },
    update: { name: "Vendor Ops", role: UserRole.VENDOR, passwordHash: vendorHash },
    create: {
      name: "Vendor Ops",
      email: "vendor@rentmojo.com",
      role: UserRole.VENDOR,
      passwordHash: vendorHash,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "user@rentmojo.com" },
    update: { name: "Demo User", role: UserRole.CUSTOMER, passwordHash: customerHash },
    create: {
      name: "Demo User",
      email: "user@rentmojo.com",
      role: UserRole.CUSTOMER,
      passwordHash: customerHash,
    },
  });

  for (const [userId, role] of [
    [admin.id, UserRole.ADMIN],
    [vendor.id, UserRole.VENDOR],
    [customer.id, UserRole.CUSTOMER],
  ]) {
    await prisma.membership.upsert({
      where: {
        userId_tenantId: {
          userId,
          tenantId: tenant.id,
        },
      },
      update: { role },
      create: {
        userId,
        tenantId: tenant.id,
        role,
      },
    });
  }

  const catalog = [
    {
      name: "Cloud Bed",
      category: ProductCategory.FURNITURE,
      monthlyRent: 1499,
      securityDeposit: 2999,
      tenureOptions: [3, 6, 12],
      description: "Storage-ready queen bed suitable for short and long city stays.",
    },
    {
      name: "Horizon Sofa",
      category: ProductCategory.FURNITURE,
      monthlyRent: 1899,
      securityDeposit: 3499,
      tenureOptions: [3, 6, 12],
      description: "Three-seater sofa for shared apartment living rooms.",
    },
    {
      name: "Chill Fridge",
      category: ProductCategory.APPLIANCE,
      monthlyRent: 2199,
      securityDeposit: 4999,
      tenureOptions: [6, 12, 18],
      description: "Energy-efficient refrigerator with quick service coverage.",
    },
  ];

  const serviceAreas = await prisma.serviceArea.findMany({ where: { tenantId: tenant.id } });

  for (const item of catalog) {
    const product = await prisma.product.upsert({
      where: {
        tenantId_name: {
          tenantId: tenant.id,
          name: item.name,
        },
      },
      update: {
        monthlyRent: item.monthlyRent,
        securityDeposit: item.securityDeposit,
        tenureOptions: item.tenureOptions,
        description: item.description,
      },
      create: {
        tenantId: tenant.id,
        name: item.name,
        category: item.category,
        monthlyRent: item.monthlyRent,
        securityDeposit: item.securityDeposit,
        tenureOptions: item.tenureOptions,
        description: item.description,
      },
    });

    for (const area of serviceAreas) {
      await prisma.inventory.upsert({
        where: {
          productId_serviceAreaId: {
            productId: product.id,
            serviceAreaId: area.id,
          },
        },
        update: {
          unitsTotal: 25,
          unitsReserved: 5,
        },
        create: {
          productId: product.id,
          serviceAreaId: area.id,
          unitsTotal: 25,
          unitsReserved: 5,
        },
      });
    }
  }

  console.log("Seed completed");
  console.log("Admin: admin@rentmojo.com / Admin@1234");
  console.log("Vendor: vendor@rentmojo.com / Vendor@1234");
  console.log("User: user@rentmojo.com / Customer@1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
