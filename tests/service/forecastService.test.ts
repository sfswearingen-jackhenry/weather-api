import { ForecastService } from '../../src/service/forecastService';
import { ForecastRepository } from '../../src/repository/forecastRepository';
import { Forecast } from '../../src/models/forecast';
import { Characterization } from '../../src/models/characterization';
import { ForecastPeriod } from '../../src/models/forecast';

describe('ForecastService', () => {
  let mockRepository: jest.Mocked<ForecastRepository>;
  let service: ForecastService;

  beforeEach(() => {
    mockRepository = {
      getForecast: jest.fn(),
    } as unknown as jest.Mocked<ForecastRepository>;

    service = new ForecastService(mockRepository);
  });

  it('should return characterization as Cold if average temp < 50', async () => {
    const periods: ForecastPeriod[] = [
      {
        name: 'Night',
        temperature: 40,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
      {
        name: 'Morning',
        temperature: 45,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
    ];
    const mockForecast: Forecast = {
      periods,
      characterization: Characterization.Moderate,
    }; // initial value will be overwritten

    mockRepository.getForecast.mockResolvedValue(mockForecast);

    const result = await service.getForecast('40.7128,-74.0060');

    expect(result.characterization).toBe(Characterization.Cold);
  });

  it('should return characterization as Mild if average temp is between 50 and 75', async () => {
    const periods: ForecastPeriod[] = [
      {
        name: 'Afternoon',
        temperature: 60,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
      {
        name: 'Evening',
        temperature: 70,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
    ];
    const mockForecast: Forecast = {
      periods,
      characterization: Characterization.Cold,
    };

    mockRepository.getForecast.mockResolvedValue(mockForecast);

    const result = await service.getForecast('40.7128,-74.0060');

    expect(result.characterization).toBe(Characterization.Moderate);
  });

  it('should return characterization as Hot if average temp > 75', async () => {
    const periods: ForecastPeriod[] = [
      {
        name: 'Noon',
        temperature: 80,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
      {
        name: 'Afternoon',
        temperature: 85,
        temperatureUnit: 'F',
        windSpeed: '',
        windDirection: '',
        shortForecast: '',
        detailedForecast: '',
      },
    ];
    const mockForecast: Forecast = {
      periods,
      characterization: Characterization.Moderate,
    };

    mockRepository.getForecast.mockResolvedValue(mockForecast);

    const result = await service.getForecast('40.7128,-74.0060');

    expect(result.characterization).toBe(Characterization.Hot);
  });

  it('should call repository with correct latlon', async () => {
    const periods: ForecastPeriod[] = [];
    const mockForecast: Forecast = {
      periods,
      characterization: Characterization.Moderate,
    };
    mockRepository.getForecast.mockResolvedValue(mockForecast);

    const latlon = '40.7128,-74.0060';
    await service.getForecast(latlon);

    expect(mockRepository.getForecast).toHaveBeenCalledWith(latlon);
  });
});
