import { Request, Response, NextFunction } from 'express';
import { getForecast } from '../src/controllers/forecastController';

describe('getForecast controller', () => {
  it('should return the latlon from URL params', () => {
    const mockRequest = {
      params: { latlon: '51.5074,-0.1278' }, // example lat/lon
    } as unknown as Request;

    const mockStatus = jest.fn().mockReturnThis();
    const mockJson = jest.fn().mockReturnThis();

    const mockResponse = {
      status: mockStatus,
      json: mockJson,
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    getForecast(mockRequest, mockResponse, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      latlon: '51.5074,-0.1278',
    });
  });
});
