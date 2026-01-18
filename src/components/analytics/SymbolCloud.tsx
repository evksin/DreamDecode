type SymbolCloudProps = {
  symbols: { name: string; frequency: number }[];
};

export function SymbolCloud({ symbols }: SymbolCloudProps) {
  function getSizeValue(frequency: number) {
    if (frequency >= 8) return 56;
    if (frequency >= 5) return 40;
    if (frequency >= 3) return 28;
    return 16;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {symbols.map((symbol) => (
        <span
          key={symbol.name}
          style={{
            fontSize: `${getSizeValue(symbol.frequency)}px`,
            background:
              "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
            WebkitBackgroundClip: "text",
            color: "transparent",
            transition: "transform 0.3s ease",
          }}
        >
          {symbol.name}
        </span>
      ))}
    </div>
  );
}
