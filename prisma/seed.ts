import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { seedTemplates } from "../src/server/data/seedTemplates";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { id: "demo_user" },
    update: {},
    create: {
      id: "demo_user",
      name: "Demo User"
    }
  });

  for (const template of seedTemplates) {
    await prisma.studioTemplate.upsert({
      where: { slug: template.slug },
      update: {
        name: template.name,
        category: template.category,
        description: template.description,
        coverUrl: template.coverUrl,
        coverPalette: template.coverPalette as Prisma.InputJsonValue,
        tags: template.tags as Prisma.InputJsonValue,
        locationAnchor: template.locationAnchor as Prisma.InputJsonValue,
        promptBase: template.promptBase,
        negativePrompt: template.negativePrompt,
        variables: template.variables as Prisma.InputJsonValue,
        defaultSettings: template.defaultSettings as Prisma.InputJsonValue,
        isActive: template.isActive,
        version: template.version
      },
      create: {
        id: template.id,
        slug: template.slug,
        name: template.name,
        category: template.category,
        description: template.description,
        coverUrl: template.coverUrl,
        coverPalette: template.coverPalette as Prisma.InputJsonValue,
        tags: template.tags as Prisma.InputJsonValue,
        locationAnchor: template.locationAnchor as Prisma.InputJsonValue,
        promptBase: template.promptBase,
        negativePrompt: template.negativePrompt,
        variables: template.variables as Prisma.InputJsonValue,
        defaultSettings: template.defaultSettings as Prisma.InputJsonValue,
        isActive: template.isActive,
        version: template.version
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
