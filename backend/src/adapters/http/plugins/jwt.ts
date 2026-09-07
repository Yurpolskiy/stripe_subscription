import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import { env } from '../../../config/env';

export function registerJwt(app: FastifyInstance) {
    app.register(fastifyJwt, { secret: env.jwtSecret });
}
