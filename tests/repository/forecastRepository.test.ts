import { ForecastRepository } from '../../src/repository/forecastRepository';

describe('ForecastRepository', () => {
  let repo: ForecastRepository;

  beforeEach(() => {
    repo = new ForecastRepository();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetches point and forecast successfully', async () => {
    const mockPointResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/TEST/forecast',
      },
    };

    const mockForecastResponse = {
      properties: {
        periods: [{ name: 'Tonight', temperature: 60 }],
      },
    };

    (global.fetch as jest.Mock)
      // First call → point metadata
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPointResponse,
      })
      // Second call → forecast
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockForecastResponse,
      });

    const result = await repo.getForecast('40.0,-90.0');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      periods: mockForecastResponse.properties.periods,
    });
  });

  test('throws on invalid lat/lon input', async () => {
    await expect(repo.getForecast('not-a-coordinate')).rejects.toThrow(
      'Invalid latlon format',
    );
  });

  test('returns empty periods array when point returns 404', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await repo.getForecast('40.0,-90.0');
    expect(result).toEqual({ periods: [] });
  });

  test('throws on failed point request (non-404 error)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(repo.getForecast('40.0,-90.0')).rejects.toThrow(
      'Failed to fetch point data: 500',
    );
  });

  test('throws when point response is missing forecast URL', async () => {
    const mockPointBad = { properties: {} };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockPointBad,
    });

    await expect(repo.getForecast('40.0,-90.0')).rejects.toThrow(
      'Forecast URL not found',
    );
  });

  test('throws on failed forecast fetch', async () => {
    (global.fetch as jest.Mock)
      // Point request
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          properties: { forecast: 'http://forecast-url' },
        }),
      })
      // Forecast request fails
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
      });

    await expect(repo.getForecast('40.0,-90.0')).rejects.toThrow(
      'Failed to fetch forecast: 502',
    );
  });
});
