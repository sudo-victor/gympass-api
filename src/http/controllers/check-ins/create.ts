import { makeCheckInUseCase } from '@/usecases/factories/make-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const checkInParamsSchema = z.object({
        gymId: z.string().uuid()
    });

    const checkInBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180;
        })
    });

    const { latitude, longitude } = checkInBodySchema.parse(request.body);
    const { gymId } = checkInParamsSchema.parse(request.params);

    const checkInUseCase = makeCheckInUseCase();

    await checkInUseCase.execute({
        gymId, userLatitude: latitude, userLongitude: longitude, userId: request.user.sub
    });

    return reply.status(201).send();
}