import {PrismaUserRepository} from "../adapters/db/PrismaUserRepository";
import {RegisterUser} from "../domain/use-cases/RegisterUser";
import {LoginUser} from "../domain/use-cases/LoginUser";
import {PrismaSubscriptionRepository} from "../adapters/db/PrismaSubscriptionRepository";
import {StripePaymentGateway} from "../adapters/payment/StripePaymentGateway";
import {SubscribeUser} from "../domain/use-cases/SubscribeUser";
import {CancelSubscription} from "../domain/use-cases/CancelSubscription";

const userRepository = new PrismaUserRepository();
const subscriptionRepository = new PrismaSubscriptionRepository();
const paymentGateway = new StripePaymentGateway()

export const registerUser = new RegisterUser(userRepository);
export const loginUser = new LoginUser(userRepository)
export const subscribeUser = new SubscribeUser(userRepository, subscriptionRepository, paymentGateway)
export const cancelSubscription = new CancelSubscription(subscriptionRepository, paymentGateway)