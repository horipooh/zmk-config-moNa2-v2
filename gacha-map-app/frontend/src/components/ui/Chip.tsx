interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}

export function Chip({ label, active, onClick, color }: ChipProps) {
  return (
    <button
      className={`chip ${active ? 'chip-active' : ''}`}
      style={color && active ? { backgroundColor: color, borderColor: color } : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
