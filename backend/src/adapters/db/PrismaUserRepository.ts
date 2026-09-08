import {db} from "../../prisma/db";
import {User} from "../../domain/entities/User";
import type {UserRepository} from "../../domain/ports/UserRepository";

export class PrismaUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const row = await db.orm.public.User.where({email: email}).first()
        return row ? new User(row.id, row.email, row.passwordHash, row.stripeCustomerId)
            : null
    }

    async findById(id: string): Promise<User | null> {
        const row = await db.orm.public.User.first({id})
        return row ? new User(row.id, row.email, row.passwordHash, row.stripeCustomerId)
            : null
    }

    async save(user: User): Promise<void> {
        await db.orm.public.User.create({id: user.id, email: user.email, passwordHash: user.passwordHash})
    }

    async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
        await db.orm.public.User.where({id: userId}).update({stripeCustomerId})
    }
}