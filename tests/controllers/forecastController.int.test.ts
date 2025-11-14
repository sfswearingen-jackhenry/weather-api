import request from 'supertest';
import app from '../../src/app';
import config from '../../src/config/config';
import http from 'http';

describe('Forecast API Integration Test', () => {
  let server: http.Server;

  beforeAll(() => {
    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /forecast/:latlon should return the correct response', async () => {
    const latlon = '39.7456,-97.0892';
    const res = await request(server).get(`/api/forecast/${latlon}`);
    expect(res.status).toBe(200);
  });

  it('GET /forceast/:latlon should return invalid', async () => {
    const latlon = 'A, A';
    const res = await request(server).get(`/api/forecast/${latlon}`);
    expect(res.status).toBe(400);
  });
});
