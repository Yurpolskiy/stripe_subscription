import {PrismaUserRepository} from "../adapters/db/PrismaUserRepository";
import {RegisterUser} from "../domain/use-cases/RegisterUser";
import {LoginUser} from "../domain/use-cases/LoginUser";

const userRepository = new PrismaUserRepository();
export const registerUser = new RegisterUser(userRepository);
export const loginUser = new LoginUser(userRepository);