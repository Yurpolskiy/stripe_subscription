import type {SubscriptionRepository} from "../../domain/ports/SubscriptionRepository";
import  {Subscription} from "../../domain/entities/Subscription";
import {db} from "../../prisma/db";

export class PrismaSubscriptionRepository implements SubscriptionRepository {
    async findActiveByUserId(userId: string): Promise<Subscription | null> {
        const row = await db.orm.public.Subscription
            .where({userId: userId, status: "ACTIVE"})
            .first()
        return row ?
            new Subscription(row.id, row.userId, row.stripeSubscriptionId, row.stripePriceId, row.status, new Date(row.currentPeriodEnd), row.cancelAtPeriodEnd)
            : null
    }

    async save(subscription: Subscription): Promise<void> {
        await db.orm.public.Subscription.upsert({
            create: {
                id: subscription.id,
                userId: subscription.userId,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripePriceId: subscription.stripePriceId,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            },
            update: {
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            },
        })
    }

}