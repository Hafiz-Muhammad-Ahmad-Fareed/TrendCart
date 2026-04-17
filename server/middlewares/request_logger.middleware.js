import logger from "../config/winston.config.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - IP: ${req.ip}`,
    );
  });

  next();
};

export default requestLogger;
