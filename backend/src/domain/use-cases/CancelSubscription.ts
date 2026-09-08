import {Subscription} from "../entities/Subscription"
import type {SubscriptionRepository} from "../ports/SubscriptionRepository"
import type {PaymentGateway} from "../ports/PaymentGateway"
import {NoActiveSubscriptionError} from "../errors/NoActiveSubscriptionError"

export class CancelSubscription {
    constructor(
        private readonly subscriptions: SubscriptionRepository,
        private readonly payments: PaymentGateway,
    ) {}

    async execute(userId: string): Promise<Subscription> {
        const subscription = await this.subscriptions.findActiveByUserId(userId)
        if (!subscription) throw new NoActiveSubscriptionError(userId)

        await this.payments.cancelSubscription(subscription.stripeSubscriptionId)

        const updated = new Subscription(
            subscription.id,
            subscription.userId,
            subscription.stripeSubscriptionId,
            subscription.stripePriceId,
            subscription.status,
            subscription.currentPeriodEnd,
            true,
        )

        await this.subscriptions.save(updated)
        return updated
    }
}
