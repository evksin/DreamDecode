export type EmotionType =
  | "Радость"
  | "Страх"
  | "Полёт"
  | "Спокойствие"
  | "Тревога"
  | "Любопытство"
  | "Не указано";

export type AnalysisSymbol = {
  name: string;
  meaning: string;
};

export type AnalysisResult = {
  interpretation: string;
  psychologicalMeaning: string;
  symbols: AnalysisSymbol[];
  recommendations: string;
};

export type DreamInput = {
  title?: string;
  description: string;
  emotion?: EmotionType;
  clarity?: number;
  lucid?: boolean;
  analysis?: string;
  interpretation?: string;
  symbols?: AnalysisSymbol[];
  tags?: string[];
  dreamDate?: Date;
};

export type DreamListItem = {
  id: string;
  title: string;
  description: string;
  emotion: string | null;
  clarity: number | null;
  lucid: boolean;
  dreamDate: Date;
  createdAt: Date;
};

export type AnalyticsSummary = {
  totalDreams: number;
  avgClarity: number;
  topEmotion: string | null;
  topSymbols: { name: string; frequency: number }[];
  monthlySeries: { date: string; count: number }[];
};
