import { Router, Request, Response } from 'express';
import { mockProducts, mockReleases } from '../data/mockData';
import { GachaProduct } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  let products = [...mockProducts];
  const { q, manufacturer, series, active } = req.query;

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.series.toLowerCase().includes(query) ||
        p.manufacturer.toLowerCase().includes(query)
    );
  }
  if (manufacturer && typeof manufacturer === 'string') {
    products = products.filter((p) => p.manufacturer === manufacturer);
  }
  if (series && typeof series === 'string') {
    products = products.filter((p) => p.series === series);
  }

  res.json({
    data: products,
    total: products.length,
    updatedAt: new Date().toISOString(),
  });
});

router.get('/manufacturers', (_req: Request, res: Response) => {
  const manufacturers = [...new Set(mockProducts.map((p) => p.manufacturer))];
  res.json({ data: manufacturers, updatedAt: new Date().toISOString() });
});

router.get('/series', (req: Request, res: Response) => {
  let products = mockProducts;
  const { manufacturer } = req.query;
  if (manufacturer && typeof manufacturer === 'string') {
    products = products.filter((p) => p.manufacturer === manufacturer);
  }
  const series = [...new Set(products.map((p) => p.series))];
  res.json({ data: series, updatedAt: new Date().toISOString() });
});

router.get('/releases', (_req: Request, res: Response) => {
  res.json({
    data: mockReleases,
    total: mockReleases.length,
    updatedAt: new Date().toISOString(),
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const product = mockProducts.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
    return;
  }
  res.json({ data: product, updatedAt: new Date().toISOString() });
});

export default router;
