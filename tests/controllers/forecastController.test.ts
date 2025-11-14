import { Request, Response, NextFunction } from 'express';
import { getForecast } from '../../src/controllers/forecastController';
import { ForecastService } from '../../src/service/forecastService';
import { Forecast } from '../../src/models/forecast';

class MockForecastService implements Partial<ForecastService> {
  getForecast = jest.fn<Promise<Forecast>, [string]>();
}

describe('getForecast handler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockService: MockForecastService;

  beforeEach(() => {
    req = {
      params: { latlon: '40.0,-90.0' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    mockService = new MockForecastService();
  });

  test('returns 200 and forecast data when forecast has periods', async () => {
    mockService.getForecast!.mockResolvedValue({
      periods: [
        {
          name: 'Today',
          temperature: 72,
          temperatureUnit: '',
          windSpeed: '',
          windDirection: '',
          shortForecast: '',
          detailedForecast: '',
        },
      ],
    });

    await getForecast(
      req as Request,
      res as Response,
      next,
      mockService as unknown as ForecastService,
    );

    expect(mockService.getForecast).toHaveBeenCalledWith('40.0,-90.0');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        forecast: {
          periods: [
            {
              name: 'Today',
              temperature: 72,
              temperatureUnit: '',
              windSpeed: '',
              windDirection: '',
              shortForecast: '',
              detailedForecast: '',
            },
          ],
        },
      },
    });
  });

  test('returns 404 when forecast has no periods', async () => {
    mockService.getForecast!.mockResolvedValue({
      periods: [],
    });

    await getForecast(
      req as Request,
      res as Response,
      next,
      mockService as unknown as ForecastService,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ data: {} });
  });

  test('calls next with error when service throws', async () => {
    const error = new Error('Service failed');
    mockService.getForecast!.mockRejectedValue(error);

    await getForecast(
      req as Request,
      res as Response,
      next,
      mockService as unknown as ForecastService,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
