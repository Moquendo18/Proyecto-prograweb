import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerSocketHandlers } from './socket/handlers.js';
import authRoutes from './routes/auth.js';
import livesRoutes from './routes/lives.js';
import giftsRoutes from './routes/gifts.js';
import paymentsRoutes from './routes/payments.js';
import statsRoutes from './routes/stats.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 1e6,
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/lives', livesRoutes);
app.use('/api/gifts', giftsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

registerSocketHandlers(io);

const PORT = parseInt(process.env.PORT || '3000');
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
