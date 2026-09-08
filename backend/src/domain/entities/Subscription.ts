export type SubscriptionStatus =
    | 'ACTIVE'
    | 'CANCELED'
    | 'PAST_DUE'
    | 'TRIALING'
    | 'INCOMPLETE'
    | 'UNPAID'

export class Subscription {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly stripeSubscriptionId: string,
        public readonly stripePriceId: string,
        public readonly status: SubscriptionStatus,
        public readonly currentPeriodEnd: Date,
        public readonly cancelAtPeriodEnd: boolean,
    ) {}
}
