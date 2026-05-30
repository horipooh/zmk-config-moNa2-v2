export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size }}
      role="status"
      aria-label="読み込み中"
    />
  );
}
