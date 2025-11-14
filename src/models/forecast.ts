import { Characterization } from './characterization';

export interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface Forecast {
  characterization?: Characterization;
  periods: ForecastPeriod[];
}
