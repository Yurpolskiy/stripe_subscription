import Fastify from 'fastify'
import { registerJwt } from './plugins/jwt'
import { authRoutes } from './routes/auth.routes'

const fastify = Fastify({
    logger: true
})

registerJwt(fastify)
fastify.register(authRoutes)

fastify.get('/', (request, reply) => {
    reply.send({hello: 'world'})
})


const start = async() => {
    try {
        await fastify.listen({port: 3000})
        console.log("Server listening on port 3000")
    } catch(err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()