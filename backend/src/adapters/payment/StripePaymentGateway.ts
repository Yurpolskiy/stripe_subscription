import Stripe from 'stripe'
import {env} from "../../config/env"
import type {PaymentGateway, CreatedSubscription} from "../../domain/ports/PaymentGateway"
import type {SubscriptionStatus} from "../../domain/entities/Subscription"

const stripe = new Stripe(env.stripeSecret)

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    switch (status) {
        case 'active': return 'ACTIVE'
        case 'canceled': return 'CANCELED'
        case 'past_due': return 'PAST_DUE'
        case 'trialing': return 'TRIALING'
        case 'incomplete': return 'INCOMPLETE'
        case 'unpaid': return 'UNPAID'
        default: return 'INCOMPLETE'
    }
}

export class StripePaymentGateway implements PaymentGateway {
    async createCustomer(email: string): Promise<string> {
        const customer = await stripe.customers.create({email})
        return customer.id
    }

    async createSubscription(customerId: string, priceId: string): Promise<CreatedSubscription> {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{price: priceId}],
        })

        const item = subscription.items.data[0]
        if (!item) throw new Error('Stripe subscription was created without an item')

        return {
            id: subscription.id,
            status: mapStatus(subscription.status),
            currentPeriodEnd: new Date(item.current_period_end * 1000),
        }
    }

    async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
        await stripe.subscriptions.cancel(stripeSubscriptionId)
    }
}
