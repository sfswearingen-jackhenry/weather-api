import { Request, Response, NextFunction } from 'express';

export const getForecast = (req: Request, res: Response, fn: NextFunction) => {
  const { latlon } = req.params;

  return res.status(200).json({
    latlon,
  });
};
