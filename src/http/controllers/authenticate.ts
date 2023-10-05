import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '@/usecases/authenticate';
import { InvalidCredentialsError } from '@/usecases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/usecases/factories/make-authenticate-use-case';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUserCase = makeAuthenticateUseCase();
        await authenticateUserCase.execute({
            email,
            password
        });
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message });
        }

        throw err;
    }

    return reply.status(200).send();
}