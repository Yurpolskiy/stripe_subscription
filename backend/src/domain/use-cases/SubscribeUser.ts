import {randomUUID} from 'node:crypto'
import {Subscription} from "../entities/Subscription"
import type {UserRepository} from "../ports/UserRepository"
import type {SubscriptionRepository} from "../ports/SubscriptionRepository"
import type {PaymentGateway} from "../ports/PaymentGateway"
import {UserNotFoundError} from "../errors/UserNotFoundError"
import {SubscriptionAlreadyActiveError} from "../errors/SubscriptionAlreadyActiveError"

export class SubscribeUser {
    constructor(
        private readonly users: UserRepository,
        private readonly subscriptions: SubscriptionRepository,
        private readonly payments: PaymentGateway,
    ) {}

    async execute(userId: string, priceId: string): Promise<Subscription> {
        const user = await this.users.findById(userId)
        if (!user) throw new UserNotFoundError(userId)

        const existing = await this.subscriptions.findActiveByUserId(userId)
        if (existing) throw new SubscriptionAlreadyActiveError(userId)

        let stripeCustomerId = user.stripeCustomerId
        if (!stripeCustomerId) {
            stripeCustomerId = await this.payments.createCustomer(user.email)
            await this.users.updateStripeCustomerId(user.id, stripeCustomerId)
        }

        const created = await this.payments.createSubscription(stripeCustomerId, priceId)

        const subscription = new Subscription(
            randomUUID(),
            userId,
            created.id,
            priceId,
            created.status,
            created.currentPeriodEnd,
            false,
        )

        await this.subscriptions.save(subscription)
        return subscription
    }
}
