const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.dream.findFirst();
  if (existing) {
    return;
  }

  const water = await prisma.symbol.upsert({
    where: { name: "вода" },
    update: { frequency: { increment: 1 } },
    create: {
      name: "вода",
      meaning: "символ эмоций, подсознания и внутренней текучести",
      frequency: 1,
    },
  });

  const flight = await prisma.symbol.upsert({
    where: { name: "полет" },
    update: { frequency: { increment: 1 } },
    create: {
      name: "полет",
      meaning: "свобода, стремление к росту и выход за границы",
      frequency: 1,
    },
  });

  await prisma.dream.create({
    data: {
      title: "Ночной океан и светящаяся луна",
      description:
        "Я стоял на берегу и видел светящийся океан. Над водой летели птицы, а луна была огромной.",
      emotion: "Спокойствие",
      clarity: 7,
      lucid: false,
      interpretation:
        "Сон о воде и луне может отражать стремление к внутреннему балансу.",
      analysis:
        "Психологически это может указывать на потребность в эмоциональной регуляции и принятии.",
      tags: ["спокойствие", "вода", "луна"],
      symbols: {
        connect: [{ id: water.id }, { id: flight.id }],
      },
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
