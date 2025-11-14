import app from './app';
import config from './config/config';

app.listen(config.port, () => {
  console.log(`Server running on port htt://localhost:${config.port}/api/forecast//39,-76`);
});
