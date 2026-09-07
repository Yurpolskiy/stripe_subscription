import type {FastifyInstance} from 'fastify'
import {registerUser} from "../../../config/di";
import {UserAlreadyExistsError} from "../../../domain/errors/UserAlreadyExistsError";
import {loginUser} from "../../../config/di";
import {InvalidCredentialsError} from "../../../domain/errors/InvalidCredentialsError";

export const authRoutes = async(app: FastifyInstance) => {
    app.post('/auth/register', async(req, reply) => {
        const {email, password} = req.body as {email: string, password: string}

        try {
            const user = await registerUser.execute(email, password)
            await reply.code(201).send({id: user.id, email: user.email})
        } catch(err) {
            if(err instanceof UserAlreadyExistsError) {
                return reply.code(409).send({error: err.message})
            }
            throw err
        }
    })

    app.post('/auth/login', async(req, reply) => {
        const {email, password} = req.body as {email: string, password: string}

        try {
            const user = await loginUser.execute(email, password)
            const token = await reply.jwtSign({ id: user.id, email: user.email })
            return reply.send({ token })
        } catch(err) {
            if(err instanceof InvalidCredentialsError) {
                return reply.code(403).send({error: err.message})
            }
            throw err
        }
    })
}