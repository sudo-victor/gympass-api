import { SearchGymsUseCase } from '../search-gyms';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
    const gymsRepository = new PrismaGymsRepository();
    const usecase = new SearchGymsUseCase(gymsRepository);
    return usecase;
}