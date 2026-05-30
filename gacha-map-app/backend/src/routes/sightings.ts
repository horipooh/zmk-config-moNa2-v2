import { Router, Request, Response } from 'express';
import { mockSnsPosts, mockProducts, mockStores } from '../data/mockData';

const router = Router();

router.get('/recent', (_req: Request, res: Response) => {
  const posts = [...mockSnsPosts]
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 20)
    .map((post) => {
      const store = post.storeId ? mockStores.find((s) => s.id === post.storeId) : null;
      const products = post.productIds
        .map((id) => mockProducts.find((p) => p.id === id))
        .filter(Boolean);
      return { ...post, store, products };
    });

  res.json({
    data: posts,
    total: posts.length,
    updatedAt: new Date().toISOString(),
  });
});

export default router;
