import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUseCheckInsHistoryUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const usecase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
    return usecase;
}