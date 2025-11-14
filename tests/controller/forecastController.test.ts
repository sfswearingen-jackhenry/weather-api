import { getForecast } from '../../src/controllers/forecastController';
import { Characterization } from '../../src/models/characterization';
import { Forecast } from '../../src/models/forecast';
import { ForecastService } from '../../src/service/forecastService';
import { Request, Response } from 'express';

describe('getForecast', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const mockForecast: Forecast = {
    characterization: Characterization.Cold,
    periods: [],
  };

  beforeEach(() => {
    req = {
      params: { latlon: '40.7128,-74.0060' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 200 and forecast data', async () => {
    const mockService = {
      getForecast: jest.fn().mockResolvedValue(mockForecast),
    };

    await getForecast(
      req as Request,
      res as Response,
      next,
      mockService as unknown as ForecastService,
    );

    expect(mockService.getForecast).toHaveBeenCalledWith('40.7128,-74.0060');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { forecast: mockForecast } });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if service throws', async () => {
    const error = new Error('Service failure');
    const mockService = { getForecast: jest.fn().mockRejectedValue(error) };

    await getForecast(
      req as Request,
      res as Response,
      next,
      mockService as unknown as ForecastService,
    );

    expect(mockService.getForecast).toHaveBeenCalledWith('40.7128,-74.0060');
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
