import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.js';
import coreRoutes from './routes/core.js';

dotenv.config({ path: '../.env', override: true });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/admin', adminRoutes);
app.use('/api', coreRoutes);

const port = Number(process.env.BACKEND_PORT || 4000);
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
