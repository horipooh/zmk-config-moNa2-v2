export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return `${Math.floor(diff / 60000)}分前`;
  if (hours < 24) return `${Math.floor(hours)}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return formatDate(iso);
}

export function formatPrice(yen: number): string {
  return `¥${yen}`;
}

export function getPinColor(lastUpdated: string): string {
  const hours = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60);
  if (hours < 48) return '#22c55e'; // green
  if (hours < 168) return '#f59e0b'; // yellow
  return '#9ca3af'; // grey
}

export function getConfirmedByLabel(by: 'official' | 'sns' | 'user'): string {
  const map = { official: '公式', sns: 'SNS', user: 'ユーザー' };
  return map[by];
}

export function getStoreTypeLabel(type: string): string {
  const map: Record<string, string> = {
    mall: 'ショッピングモール',
    station: '駅',
    standalone: '専門店',
    arcade: 'アーケード',
  };
  return map[type] ?? type;
}

export function getPlatformIcon(platform: string): string {
  const map: Record<string, string> = {
    twitter: '𝕏',
    instagram: '📷',
    tiktok: '🎵',
  };
  return map[platform] ?? '🌐';
}
