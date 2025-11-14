import express from 'express';
import forecastRoutes from './routes/forecastRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/forecast', forecastRoutes);
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
