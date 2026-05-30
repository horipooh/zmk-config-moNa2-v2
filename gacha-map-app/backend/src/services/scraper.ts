import axios from 'axios';
import * as cheerio from 'cheerio';
import { GachaProduct, ReleaseInfo } from '../types';

interface ScraperResult {
  products: Partial<GachaProduct>[];
  releases: Partial<ReleaseInfo>[];
}

// Bandai ガシャポン公式 - リリース情報取得
async function scrapeBandai(): Promise<ScraperResult> {
  try {
    const { data } = await axios.get('https://www.bandai.co.jp/catalog/gacha/', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GachaMapBot/1.0)' },
    });
    const $ = cheerio.load(data);
    const releases: Partial<ReleaseInfo>[] = [];

    // 実際のHTML構造に応じてセレクタを調整
    $('.item-list li, .product-list .item').each((_, el) => {
      const title = $(el).find('.item-name, h3, .title').text().trim();
      const dateText = $(el).find('.date, .release-date, time').text().trim();
      if (title) {
        releases.push({
          manufacturer: 'BANDAI',
          title,
          releaseDate: dateText,
          sourceUrl: 'https://www.bandai.co.jp/catalog/gacha/',
          fetchedAt: new Date().toISOString(),
        });
      }
    });

    return { products: [], releases };
  } catch {
    return { products: [], releases: [] };
  }
}

// タカラトミーアーツ - リリース情報取得
async function scrapeTakaraTomyArts(): Promise<ScraperResult> {
  try {
    const { data } = await axios.get('https://www.takaratomy-arts.co.jp/items/gacha/', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GachaMapBot/1.0)' },
    });
    const $ = cheerio.load(data);
    const releases: Partial<ReleaseInfo>[] = [];

    $('.item, .product').each((_, el) => {
      const title = $(el).find('h2, h3, .name').text().trim();
      const dateText = $(el).find('.date, time').text().trim();
      if (title) {
        releases.push({
          manufacturer: 'TAKARA TOMY ARTS',
          title,
          releaseDate: dateText,
          sourceUrl: 'https://www.takaratomy-arts.co.jp/items/gacha/',
          fetchedAt: new Date().toISOString(),
        });
      }
    });

    return { products: [], releases };
  } catch {
    return { products: [], releases: [] };
  }
}

export async function fetchAllReleases(): Promise<ScraperResult> {
  const results = await Promise.allSettled([scrapeBandai(), scrapeTakaraTomyArts()]);

  const combined: ScraperResult = { products: [], releases: [] };
  for (const result of results) {
    if (result.status === 'fulfilled') {
      combined.products.push(...result.value.products);
      combined.releases.push(...result.value.releases);
    }
  }
  return combined;
}
