"use server";

import { revalidatePath } from "next/cache";
import type { DreamInput } from "@/types";
import {
  createDream,
  deleteDream,
  getDreamAnalytics,
  getDreamById,
  getDreams,
  updateDream,
} from "@/lib/dreams";

export async function createDreamAction(data: DreamInput) {
  const dream = await createDream(data);
  revalidatePath("/");
  return { id: dream.id };
}

export async function getDreamsAction(limit = 8, offset = 0) {
  return getDreams(limit, offset);
}

export async function getDreamByIdAction(id: string) {
  return getDreamById(id);
}

export async function updateDreamAction(id: string, fields: Partial<DreamInput>) {
  const dream = await updateDream(id, fields);
  revalidatePath(`/dream/${id}`);
  return { id: dream.id };
}

export async function deleteDreamAction(id: string) {
  await deleteDream(id);
  revalidatePath("/");
  return { id };
}

export async function getDreamAnalyticsAction() {
  return getDreamAnalytics();
}
