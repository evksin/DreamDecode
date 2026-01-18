type SymbolCloudProps = {
  symbols: { name: string; frequency: number }[];
};

export function SymbolCloud({ symbols }: SymbolCloudProps) {
  function getSizeClass(frequency: number) {
    if (frequency >= 8) return "text-5xl md:text-6xl";
    if (frequency >= 5) return "text-3xl md:text-4xl";
    if (frequency >= 3) return "text-2xl md:text-3xl";
    return "text-base md:text-lg";
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      {symbols.map((symbol) => (
        <span
          key={symbol.name}
          className={`bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent transition-all duration-300 hover:scale-110 ${getSizeClass(
            symbol.frequency
          )}`}
        >
          {symbol.name}
        </span>
      ))}
    </div>
  );
}
