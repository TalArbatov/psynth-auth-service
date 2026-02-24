import pino, { LoggerOptions } from "pino";
import { trace } from "@opentelemetry/api";

const isProduction = process.env.NODE_ENV === "production";

export const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL ?? "info",
    base: {
        service: process.env.SERVICE_NAME ?? "psynth-identity-service",
        env: process.env.NODE_ENV ?? "development",
        version: process.env.APP_VERSION ?? "1.0.0",
    },
    mixin() {
        const span = trace.getActiveSpan();
        if (!span) return {};
        const { traceId, spanId } = span.spanContext();
        return { trace_id: traceId, span_id: spanId };
    },
    ...(isProduction ? {} : { transport: { target: "pino-pretty" } }),
};

export const logger = pino(loggerOptions);
