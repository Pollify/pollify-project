import { createLogger, format, transports } from "winston";
const { combine, colorize, printf, timestamp } = format;

const logger = createLogger({
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    printf(
      (log) =>
        `[${process.env.npm_package_name}] - ${log.timestamp} ${log.message}`
    )
  ),
  transports: [new transports.Console()],
});

export default logger;
