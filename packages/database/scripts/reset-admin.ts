import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@pawankalyanfan.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { email },
    data: {
      name: "Admin",
      password: hash,
      role: "ADMIN",
      isPremium: true,
      premiumBadge: true,
    },
  });

  const valid = await bcrypt.compare(password, hash);
  console.log("Admin reset:", user.email, user.role, "password ok:", valid);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
