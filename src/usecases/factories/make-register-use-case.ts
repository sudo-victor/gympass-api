import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserCase } from '../register';

export function makeRegisterUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const usecase = new RegisterUserCase(usersRepository);
    return usecase;
}