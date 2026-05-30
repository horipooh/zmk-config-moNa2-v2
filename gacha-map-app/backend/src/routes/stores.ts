import { Router, Request, Response } from 'express';
import { mockStores, mockProducts, mockSnsPosts } from '../data/mockData';

const router = Router();

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get('/', (req: Request, res: Response) => {
  let stores = [...mockStores];
  const { lat, lng, radiusKm, swLat, swLng, neLat, neLng, manufacturer, series, productId } =
    req.query;

  // Viewport bounds filter
  if (swLat && swLng && neLat && neLng) {
    const [sw_lat, sw_lng, ne_lat, ne_lng] = [swLat, swLng, neLat, neLng].map(Number);
    stores = stores.filter(
      (s) =>
        s.lat >= sw_lat && s.lat <= ne_lat && s.lng >= sw_lng && s.lng <= ne_lng
    );
  }

  // Radius filter
  if (lat && lng) {
    const radius = radiusKm ? Number(radiusKm) : 10;
    stores = stores.filter(
      (s) => haversineKm(Number(lat), Number(lng), s.lat, s.lng) <= radius
    );
  }

  // Product filter
  if (productId && typeof productId === 'string') {
    stores = stores.filter((s) => s.products.some((p) => p.productId === productId));
  }

  // Manufacturer/series filter via products
  if (manufacturer || series) {
    const filteredProductIds = mockProducts
      .filter(
        (p) =>
          (!manufacturer || p.manufacturer === manufacturer) &&
          (!series || p.series === series)
      )
      .map((p) => p.id);

    stores = stores.filter((s) =>
      s.products.some((p) => filteredProductIds.includes(p.productId))
    );
  }

  // Enrich with product counts and sort by last updated
  const enriched = stores
    .map((s) => ({
      ...s,
      productCount: s.products.length,
    }))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  res.json({
    data: enriched,
    total: enriched.length,
    updatedAt: new Date().toISOString(),
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const store = mockStores.find((s) => s.id === req.params.id);
  if (!store) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Store not found' } });
    return;
  }

  const products = store.products
    .map((sp) => {
      const product = mockProducts.find((p) => p.id === sp.productId);
      return product ? { ...sp, product } : null;
    })
    .filter(Boolean);

  res.json({
    data: { ...store, products },
    updatedAt: new Date().toISOString(),
  });
});

router.get('/:id/feed', (req: Request, res: Response) => {
  const store = mockStores.find((s) => s.id === req.params.id);
  if (!store) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Store not found' } });
    return;
  }

  const posts = mockSnsPosts
    .filter((post) => post.storeId === req.params.id)
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  res.json({
    data: {
      store,
      posts,
      total: posts.length,
    },
    updatedAt: new Date().toISOString(),
  });
});

export default router;
