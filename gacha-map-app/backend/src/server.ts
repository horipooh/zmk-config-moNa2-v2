import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import storesRouter from './routes/stores';
import sightingsRouter from './routes/sightings';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/stores', storesRouter);
app.use('/api/sightings', sightingsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎰 GachaMap Backend running at http://localhost:${PORT}`);
});

export default app;
