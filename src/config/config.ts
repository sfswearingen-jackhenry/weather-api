import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  weatherDataSource: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  weatherDataSource:
    process.env.WEATHER_DATA_SOURCE ||
    'https://api.weather.gov/points/{lat},{lon}',
};

export default config;
