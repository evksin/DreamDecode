const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.note.findFirst();
  if (existing) {
    return;
  }

  await prisma.note.create({
    data: {
      title: "Первая заметка из seed",
    },
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
