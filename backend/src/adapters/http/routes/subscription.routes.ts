import {FastifyInstance} from "fastify";
import {subscribeUser, cancelSubscription} from "../../../config/di";
import {UserNotFoundError} from "../../../domain/errors/UserNotFoundError";
import {SubscriptionAlreadyActiveError} from "../../../domain/errors/SubscriptionAlreadyActiveError";
import {NoActiveSubscriptionError} from "../../../domain/errors/NoActiveSubscriptionError";

export const subscriptionRoutes = async(app: FastifyInstance) => {
    app.post("/subscriptions", async (req, reply) => {
        await req.jwtVerify()
        const {priceId} = req.body as {pridceId: string}
        const userId = (req.user as {id: string}).id

        try {
            const subscription = await subscribeUser.execute(userId, priceId)
            return reply.code(201).send(subscription)
        } catch(err) {
            if (err instanceof UserNotFoundError) {
                return reply.code(404).send({error: err.message})
            }
            if(err instanceof SubscriptionAlreadyActiveError) {
                return reply.code(409).send({error: err.message})
            }
            throw err
        }
    })

    app.post('/subscriptions/cancel', async(req, reply) => {
        await req.jwtVerify()
        const userId = (req.user as {id: string}).id

        try {
            const subscription = await cancelSubscription.execute(userId)
            return reply.send(subscription)
        } catch(err) {
            if(err instanceof NoActiveSubscriptionError) {
                return reply.code(404).send({error: err.message})
            }
            throw err
        }
    })
}