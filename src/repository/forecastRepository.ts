import { Forecast } from '../models/forecast';

export interface PointProperties {
  forecast: string;
  forecastHourly: string;
}

export interface PointResponse {
  properties: PointProperties;
}

export interface ForecastAPIResponse {
  properties: {
    periods: Forecast['periods'];
  };
}

export class ForecastRepository {
  private headers = {
    Accept: 'application/geo+json',
    'User-Agent': 'Jack Henry Demo', // Recommended by NWS
  };
  async getForecast(latlon: string): Promise<Forecast> {
    const [latStr, lonStr] = latlon.split(',');
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Invalid latlon format. Expected "lat,lon"');
    }

    const url = `https://api.weather.gov/points/${lat},${lon}`;
    const pointRes = await fetch(url, { headers: this.headers });
    if (pointRes.status === 404) {
      return { periods: [] };
    }
    if (!pointRes.ok) {
      throw new Error(`Failed to fetch point data: ${pointRes.status}`);
    }
    const pointData: PointResponse = await pointRes.json();
    const forecastUrl = pointData.properties?.forecast;
    if (!forecastUrl) {
      throw new Error('Forecast URL not found in point response');
    }

    // Step 2: Fetch the forecast
    const forecastRes = await fetch(forecastUrl, {
      headers: this.headers,
    });
    if (!forecastRes.ok) {
      throw new Error(`Failed to fetch forecast: ${forecastRes.status}`);
    }
    const forecastData: ForecastAPIResponse = await forecastRes.json();

    return { periods: forecastData.properties?.periods };
  }
}
