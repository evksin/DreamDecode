import { NextResponse } from "next/server";
import { analyzeDream } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { description, emotion, clarity } = await request.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Описание сна обязательно." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY не задан." },
        { status: 500 }
      );
    }

    const result = await analyzeDream({
      description,
      emotion,
      clarity,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось проанализировать сон." },
      { status: 500 }
    );
  }
}
