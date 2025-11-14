import { Router } from 'express';
import { getForecast } from '../controllers/forecastController';
import { validate } from '../middlewares/validationMiddleware';
import { param } from 'express-validator';

const router = Router();

router.get(
  '/:latlon',
  validate([
    param('latlon')
      .isLatLong()
      .withMessage('Valid latitude, longitude is required'),
  ]),
  getForecast,
);

export default router;
