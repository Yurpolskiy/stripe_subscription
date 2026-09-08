export class NoActiveSubscriptionError extends Error {
    constructor(userId: string) {
        super(`User ${userId} has no active subscription`);
        this.name = 'NoActiveSubscriptionError';
    }
}
