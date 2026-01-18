type SymbolCloudProps = {
  symbols: { name: string; frequency: number }[];
};

export function SymbolCloud({ symbols }: SymbolCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {symbols.map((symbol) => (
        <span
          key={symbol.name}
          className="rounded-full border border-border-color px-3 py-1 text-xs text-text-secondary"
        >
          {symbol.name} · {symbol.frequency}
        </span>
      ))}
    </div>
  );
}
