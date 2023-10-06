import { GetUserProfileUseCase } from '../get-user-profile';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';

export function makeGetUserProfileUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const usecase = new GetUserProfileUseCase(usersRepository);
    return usecase;
}