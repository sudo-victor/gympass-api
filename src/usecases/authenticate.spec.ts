import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { expect, it, describe, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'jhondoe@email.com',
            password_hash: (await hash('123456', 6))
        });

        const { user } = await sut.execute({
            email: 'jhondoe@email.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'jhondoe@email.com',
            password_hash: (await hash('123456', 6))
        });

        await expect(() => sut.execute({
            email: 'jhondoea@email.com',
            password: '123456',
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'jhondoe@email.com',
            password_hash: (await hash('123456', 6))
        });

        await expect(() => sut.execute({
            email: 'jhondoe@email.com',
            password: '1234567',
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});