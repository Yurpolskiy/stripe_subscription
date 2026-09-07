import type {UserRepository} from "../ports/UserRepository";
import type {User} from "../entities/User";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import bcrypt from 'bcrypt'

export class LoginUser {
    constructor(private readonly users: UserRepository) {}

    async execute(email: string, password: string): Promise<User> {
        const user = await this.users.findByEmail(email)
        if(!user) throw new InvalidCredentialsError()

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if(!isValid) throw new InvalidCredentialsError()

        return user
    }
}