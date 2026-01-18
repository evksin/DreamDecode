import { prisma } from "@/lib/prisma";
import type { AnalysisSymbol, DreamInput, DreamListItem } from "@/types";

export async function getDreams(
  limit = 8,
  offset = 0
): Promise<DreamListItem[]> {
  return prisma.dream.findMany({
    orderBy: { dreamDate: "desc" },
    take: limit,
    skip: offset,
    select: {
      id: true,
      title: true,
      description: true,
      emotion: true,
      clarity: true,
      lucid: true,
      dreamDate: true,
      createdAt: true,
    },
  });
}

export async function getDreamById(id: string) {
  return prisma.dream.findUnique({
    where: { id },
    include: {
      symbols: true,
    },
  });
}

async function upsertSymbols(symbols: AnalysisSymbol[]) {
  const results = [];
  for (const symbol of symbols) {
    const saved = await prisma.symbol.upsert({
      where: { name: symbol.name },
      update: {
        meaning: symbol.meaning,
        frequency: { increment: 1 },
      },
      create: {
        name: symbol.name,
        meaning: symbol.meaning,
        frequency: 1,
      },
    });
    results.push(saved);
  }
  return results;
}

export async function createDream(data: DreamInput) {
  const symbols = data.symbols?.length ? await upsertSymbols(data.symbols) : [];

  return prisma.dream.create({
    data: {
      title: data.title?.trim() || "Без названия",
      description: data.description,
      emotion: data.emotion,
      clarity: data.clarity,
      lucid: data.lucid ?? false,
      analysis: data.analysis,
      interpretation: data.interpretation,
      tags: data.tags ?? [],
      dreamDate: data.dreamDate ?? new Date(),
      symbols: symbols.length
        ? {
            connect: symbols.map((symbol) => ({ id: symbol.id })),
          }
        : undefined,
    },
  });
}

export async function updateDream(
  id: string,
  fields: Partial<DreamInput>
) {
  return prisma.dream.update({
    where: { id },
    data: {
      title: fields.title,
      description: fields.description,
      emotion: fields.emotion,
      clarity: fields.clarity,
      lucid: fields.lucid,
      analysis: fields.analysis,
      interpretation: fields.interpretation,
      tags: fields.tags,
    },
  });
}

export async function deleteDream(id: string) {
  return prisma.dream.delete({ where: { id } });
}

export async function getDreamAnalytics() {
  const dreams = await prisma.dream.findMany({
    where: {
      dreamDate: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      },
    },
    select: {
      dreamDate: true,
      clarity: true,
      emotion: true,
    },
  });

  const totalDreams = dreams.length;
  const avgClarity =
    dreams.reduce((sum, dream) => sum + (dream.clarity ?? 0), 0) /
    (totalDreams || 1);

  const emotionCounts: Record<string, number> = {};
  for (const dream of dreams) {
    if (!dream.emotion) continue;
    emotionCounts[dream.emotion] = (emotionCounts[dream.emotion] ?? 0) + 1;
  }

  const topEmotion =
    Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const recentDreams = await prisma.dream.findMany({
    where: {
      dreamDate: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
    include: { symbols: true },
  });

  const symbolCounts: Record<string, number> = {};
  for (const dream of recentDreams) {
    for (const symbol of dream.symbols) {
      symbolCounts[symbol.name] = (symbolCounts[symbol.name] ?? 0) + 1;
    }
  }

  const symbols = Object.entries(symbolCounts)
    .map(([name, frequency]) => ({ name, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const byDay: Record<string, number> = {};
  for (const dream of dreams) {
    const key = dream.dreamDate.toISOString().slice(0, 10);
    byDay[key] = (byDay[key] ?? 0) + 1;
  }

  const monthlySeries = Object.entries(byDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  return {
    totalDreams,
    avgClarity,
    topEmotion,
    topSymbols: symbols,
    monthlySeries,
  };
}
