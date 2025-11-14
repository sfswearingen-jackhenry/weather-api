import { Forecast, ForecastPeriod } from '../models/forecast';
import { Characterization } from '../models/characterization';
import { ForecastRepository } from '../repository/forecastRepository';

export class ForecastService {
  private forecastRepository: ForecastRepository;

  constructor(forecastRepository: ForecastRepository) {
    this.forecastRepository = forecastRepository;
  }

  async getForecast(latlon: string): Promise<Forecast> {
    const forecast = await this.forecastRepository.getForecast(latlon);

    const temperatures = forecast.periods.map(
      (p: ForecastPeriod) => p.temperature,
    );
    const avgTemp =
      temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length;

    let characterization: Characterization;
    if (avgTemp < 50) {
      characterization = Characterization.Cold;
    } else if (avgTemp >= 50 && avgTemp <= 75) {
      characterization = Characterization.Moderate;
    } else {
      characterization = Characterization.Hot;
    }

    return { ...forecast, characterization };
  }
}
