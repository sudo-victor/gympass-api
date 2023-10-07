import { makeSearchGymsUseCase } from '@/usecases/factories/make-search-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const seachGymsQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const { q, page } = seachGymsQuerySchema.parse(request.query);

    const searchGymsUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymsUseCase.execute({
        query: q, page
    });

    return reply.status(200).send({ gyms });
}