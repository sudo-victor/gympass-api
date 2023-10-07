import { makeValidateCheckInUseCase } from '@/usecases/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const checkInParamsSchema = z.object({
        checkInId: z.string().uuid()
    });

    const { checkInId } = checkInParamsSchema.parse(request.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
        checkInId
    });

    return reply.status(204).send();
}