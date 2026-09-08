import 'dotenv/config';

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set`);
    return value;
}

export const env = {
    jwtSecret: required('JWT_SECRET'),
    stripeSecret: required('STRIPE_SECRET'),
};
