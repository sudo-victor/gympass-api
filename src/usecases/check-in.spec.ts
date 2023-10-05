import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        gymsRepository.create({
            id: 'gym-01',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: -22.9652187,
            longitude: -43.4152898
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 8, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        });

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        })).rejects.toBeInstanceOf(Error);
    });

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2023, 8, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        });

        vi.setSystemTime(new Date(2023, 8, 29, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.create({
            id: 'gym-02',
            title: 'Javascript Gym',
            description: '',
            phone: '',
            latitude: -22.9640629,
            longitude: -43.4042499,
        });

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -22.9652187,
            userLongitude: -43.4152898,
        })).rejects.toBeInstanceOf(Error);
    });
});