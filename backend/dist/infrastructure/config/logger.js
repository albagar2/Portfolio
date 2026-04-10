"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
/**
 * Logger de Diagnóstico Avanzado
 * Captura mensajes de error específicos para depuración profunda
 */
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` | INFO: ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
    })),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
//# sourceMappingURL=logger.js.map