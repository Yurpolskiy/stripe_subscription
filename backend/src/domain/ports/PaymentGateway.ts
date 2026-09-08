import type {SubscriptionStatus} from "../entities/Subscription"

export interface CreatedSubscription {
    id: string
    status: SubscriptionStatus
    currentPeriodEnd: Date
}

export interface PaymentGateway {
    createCustomer(email: string): Promise<string>
    createSubscription(customerId: string, priceId: string): Promise<CreatedSubscription>
    cancelSubscription(stripeSubscriptionId: string): Promise<void>
}
