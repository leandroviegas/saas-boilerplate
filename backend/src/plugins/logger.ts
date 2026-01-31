import winston from 'winston';
import 'winston-daily-rotate-file';

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'grey'
};

const levelMap: Record<number, string> = {
  10: 'debug',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'error'
};
winston.addColors(levelColors);

const normalizeLevelFormat = winston.format((info) => {
  if (typeof info.level === 'number') {
    info.level = levelMap[info.level] || 'info';
  }
  return info;
});

const flattenMessageFormat = winston.format((info) => {
  try {
    const parsed = JSON.parse(info.message as string);
    const msg = parsed.msg || info.message;
    delete parsed.msg;

    return {
      ...info,
      ...parsed,
      message: msg,
    };
  } catch {
    return info;
  }
});

const colorizer = winston.format.colorize();

const consoleFormat = winston.format.combine(
  normalizeLevelFormat(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  flattenMessageFormat(),
  winston.format.printf(({ timestamp, level, message }) => {
    let coloredLevel = level;
    try {
      coloredLevel = colorizer.colorize(level, String(level).toUpperCase());
    } catch (e) {
    }
    return `${timestamp} [${coloredLevel}]: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  normalizeLevelFormat(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  flattenMessageFormat(),
  winston.format.json()
);

const createRotatingTransport = (
  filename: string, 
  level: string, 
  maxFiles: string = '14d', 
  maxSize: string = '20m'
) => {
  const transport = new winston.transports.DailyRotateFile({
    filename: `logs/%DATE%/${filename}.log`,
    datePattern: 'YYYY-MM-DD',
    level,
    maxFiles,
    maxSize,
    format: fileFormat,
    zippedArchive: true,
    auditFile: `logs/.${filename}-audit.json`
  });

  transport.on('rotate', (oldFilename, newFilename) => {
    console.log(`Log rotated from ${oldFilename} to ${newFilename}`);
  });

  return transport;
};

const consoleTransport = new winston.transports.Console({ 
  format: consoleFormat 
});

const errorLogTransport = createRotatingTransport('error', 'error');
const warnLogTransport = createRotatingTransport('warn', 'warn');
const infoLogTransport = createRotatingTransport('info', 'info');
const debugLogTransport = createRotatingTransport('debug', 'debug', '7d');
const combinedLogTransport = createRotatingTransport('combined', 'silly', '30d', '50m');

const logger = winston.createLogger({
  format: fileFormat,
  defaultMeta: { service: 'fastify-api' },
  transports: [
    errorLogTransport,
    warnLogTransport,
    infoLogTransport,
    debugLogTransport,
    combinedLogTransport,
    consoleTransport
  ]
});

export default logger;