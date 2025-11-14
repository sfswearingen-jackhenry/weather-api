import { Request, Response, NextFunction } from 'express';
import { Forecast } from '../models/forecast';
import { ForecastService } from '../service/forecastService';
import { ForecastRepository } from '../repository/forecastRepository';

export const forecastService = new ForecastService(new ForecastRepository());

export const getForecast = async (
  req: Request,
  res: Response,
  next: NextFunction,
  service: ForecastService = forecastService,
) => {
  const { latlon } = req.params;

  try {
    const forecast: Forecast = await service.getForecast(latlon);
    if (forecast.periods.length === 0) {
      return res.status(404).json({ data: {} });
    }
    return res.status(200).json({
      data: { forecast },
    });
  } catch (err) {
    next(err);
  }
};
