import axios from 'axios';
import { SnsPost } from '../types';

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

interface TwitterSearchResponse {
  data?: {
    id: string;
    text: string;
    author_id: string;
    created_at: string;
    public_metrics: { like_count: number };
    geo?: { place_id: string };
  }[];
  includes?: {
    users?: { id: string; username: string }[];
    places?: { id: string; full_name: string; geo: { bbox: number[] } }[];
  };
}

const GACHA_SEARCH_QUERIES = [
  'ガチャガチャ 入荷 lang:ja',
  'ガシャポン 新商品 lang:ja',
  'カプセルトイ 発見 lang:ja',
  'ガチャ コンプ lang:ja',
];

export async function fetchTwitterPosts(productName?: string): Promise<SnsPost[]> {
  if (!TWITTER_BEARER_TOKEN) {
    return [];
  }

  const query = productName
    ? `${productName} ガチャ lang:ja -is:retweet has:images`
    : 'ガチャガチャ 入荷 OR 新商品 lang:ja -is:retweet has:images';

  try {
    const response = await axios.get<TwitterSearchResponse>(
      'https://api.twitter.com/2/tweets/search/recent',
      {
        params: {
          query,
          max_results: 20,
          'tweet.fields': 'created_at,public_metrics,geo,author_id',
          'user.fields': 'username',
          'place.fields': 'full_name,geo',
          expansions: 'author_id,geo.place_id',
        },
        headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
        timeout: 10000,
      }
    );

    const tweets = response.data.data ?? [];
    const users = response.data.includes?.users ?? [];
    const places = response.data.includes?.places ?? [];

    return tweets.map((tweet) => {
      const author = users.find((u) => u.id === tweet.author_id);
      const place = places.find((p) => tweet.geo?.place_id === p.id);

      let locationCoords: { lat: number; lng: number } | undefined;
      if (place?.geo?.bbox) {
        const [minLng, minLat, maxLng, maxLat] = place.geo.bbox;
        locationCoords = {
          lat: (minLat + maxLat) / 2,
          lng: (minLng + maxLng) / 2,
        };
      }

      return {
        id: tweet.id,
        platform: 'twitter' as const,
        text: tweet.text,
        author: `@${author?.username ?? 'unknown'}`,
        authorUrl: `https://twitter.com/${author?.username ?? ''}`,
        imageUrls: [],
        postedAt: tweet.created_at,
        likes: tweet.public_metrics?.like_count ?? 0,
        locationName: place?.full_name,
        locationCoords,
        productIds: [],
      };
    });
  } catch {
    return [];
  }
}

export function extractLocationFromText(text: string): string | null {
  const patterns = [
    /([^\s]+(?:駅|モール|パルコ|イオン|ヨドバシ|ビックカメラ|ラゾーナ|サンシャイン))/,
    /(秋葉原|渋谷|新宿|池袋|銀座|上野|浅草|原宿|表参道|六本木)/,
    /(難波|心斎橋|梅田|天王寺|なんば)/,
    /(横浜|川崎|船橋|柏|さいたま|千葉)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractProductsFromText(text: string, productNames: string[]): string[] {
  return productNames.filter((name) =>
    name
      .split(' ')
      .some((word) => word.length > 2 && text.includes(word))
  );
}

export { GACHA_SEARCH_QUERIES };
