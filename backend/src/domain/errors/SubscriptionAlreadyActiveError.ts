export class SubscriptionAlreadyActiveError extends Error {
    constructor(userId: string) {
        super(`User ${userId} already has an active subscription`);
        this.name = 'SubscriptionAlreadyActiveError';
    }
}
