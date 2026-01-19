"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const promptSchema = z.object({
  title: z.string().trim().min(1, "Укажите название").max(255),
  content: z.string().trim().min(1, "Укажите текст"),
  isPublic: z.boolean().default(false),
});

const listSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(50),
  mode: z.enum(["mine", "public", "favorites"]),
});

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Пользователь не авторизован");
  }
  return session.user.id;
}

export type PromptListItem = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export async function listPrompts(input: z.infer<typeof listSchema>) {
  const userId = await requireUserId();
  const { query, page, pageSize, mode } = listSchema.parse(input);
  const search = query?.trim();

  const baseWhere: Prisma.PromptWhereInput =
    mode === "public"
      ? { isPublic: true }
      : mode === "favorites"
        ? { userId, isFavorite: true }
        : { userId };

  const queryMode: Prisma.QueryMode = "insensitive";
  const where: Prisma.PromptWhereInput = search
    ? {
        ...baseWhere,
        OR: [
          { title: { contains: search, mode: queryMode } },
          { content: { contains: search, mode: queryMode } },
        ],
      }
    : baseWhere;

  const [total, items] = await Promise.all([
    prisma.prompt.count({ where }),
    prisma.prompt.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const normalized: PromptListItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    isPublic: item.isPublic,
    isFavorite: item.isFavorite,
    userId: item.userId,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return { total, items: normalized, currentUserId: userId };
}

export async function createPrompt(input: z.infer<typeof promptSchema>) {
  const userId = await requireUserId();
  const data = promptSchema.parse(input);

  const created = await prisma.prompt.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return created;
}

export async function updatePrompt(id: string, input: z.infer<typeof promptSchema>) {
  const userId = await requireUserId();
  const data = promptSchema.parse(input);

  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) {
    throw new Error("Нет доступа к изменению этого сна");
  }

  const updated = await prisma.prompt.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
  return updated;
}

export async function deletePrompt(id: string) {
  const userId = await requireUserId();

  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) {
    throw new Error("Нет доступа к удалению этого сна");
  }

  await prisma.prompt.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
}

export async function togglePublic(id: string) {
  const userId = await requireUserId();

  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) {
    throw new Error("Нет доступа к изменению этого сна");
  }

  const updated = await prisma.prompt.update({
    where: { id },
    data: { isPublic: !prompt.isPublic },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  return updated;
}

export async function toggleFavorite(id: string) {
  const userId = await requireUserId();

  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) {
    throw new Error("Нет доступа к изменению этого сна");
  }

  const updated = await prisma.prompt.update({
    where: { id },
    data: { isFavorite: !prompt.isFavorite },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/favorites");
  return updated;
}
