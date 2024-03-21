import winston from "winston";

const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  };

  winston.addColors(levels);
  
  // Logger para desarrollo
const devLogger = winston.createLogger({
    levels,
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.simple()
      })
    ]
  });
  
  // Logger para producción
  const prodLogger = winston.createLogger({
    levels,
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error'
      })
    ]
  });
  
  // Función para obtener el logger según el entorno
  const getLogger = () => {
    if (process.env.NODE_ENV === 'production') {
      return prodLogger;
    } else {
      return devLogger;
    }
  };

  const logger = getLogger();

logger.debug('Mensaje de debug');
logger.http('Mensaje de HTTP');
logger.info('Mensaje de info');
logger.warning('Mensaje de advertencia');
logger.error('Mensaje de error');
logger.fatal('Mensaje fatal');

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: "http"}),
//         new winston.transports.File({filename: "./errors.log", level:"error"})
//     ]
// });

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next();
}