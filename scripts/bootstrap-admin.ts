import "dotenv/config";
import { db } from "../src/lib/db";
import { Role } from "../generated/prisma/client";

async function bootstrapAdmin() {
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    console.error("❌ Error: ADMIN_BOOTSTRAP_EMAIL environment variable is not set.");
    console.error("Usage example:");
    console.error("  $env:ADMIN_BOOTSTRAP_EMAIL=\"admin@yourdomain.com\"; npx tsx scripts/bootstrap-admin.ts");
    process.exit(1);
  }

  console.log(`🔍 Looking for user with email: ${adminEmail}...`);

  const user = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (!user) {
    console.error(`❌ User not found: No account registered with email ${adminEmail}.`);
    console.error("👉 Please register the account first at /auth/register, then rerun this script.");
    process.exit(1);
  }

  if (user.role === Role.ADMIN) {
    console.log(`ℹ️ User ${adminEmail} is already an ADMIN.`);
    process.exit(0);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: Role.ADMIN },
  });

  console.log(`✅ Success: User ${updated.email} (${updated.name || "N/A"}) has been promoted to ADMIN.`);
}

bootstrapAdmin()
  .catch((err) => {
    console.error("Bootstrap script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
