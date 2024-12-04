import app from "./app.js";
import http from "http";
import config from "./utils/config.js";
import logger from "./utils/logger.js";


const server = http.createServer(app);

// const PORT = config.PORT || 4000; 
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
