import bcrypt from 'bcrypt'
import {randomUUID} from 'node:crypto'
import {User} from "../entities/User";
import type {UserRepository} from "../ports/UserRepository";
import {UserAlreadyExistsError} from "../errors/UserAlreadyExistsError";


export class RegisterUser {
    constructor(private readonly users: UserRepository) {}

    async execute(email: string, password: string): Promise<User> {
        const existing = await this.users.findByEmail(email)
        if(existing) throw new UserAlreadyExistsError(email)

        const passwordHash = await bcrypt.hash(password, 10) // потом засунуть в .env
        const user = new User(randomUUID(), email, passwordHash, null) // айдишник потом генерить на уровне базы

        await this.users.save(user)
        return user
    }
}