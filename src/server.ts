import app from './app';
import config from './config/config';

app.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
  console.log(`Sample url http://localhost:${config.port}/api/forecast/39,-76`);
});
