import {Subscription} from "../entities/Subscription"

export interface SubscriptionRepository {
    findActiveByUserId(userId: string): Promise<Subscription | null>
    save(subscription: Subscription): Promise<void>
}
