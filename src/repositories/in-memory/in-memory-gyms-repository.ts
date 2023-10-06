import { Gym, Prisma, User } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/usecases/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async findManyNearby(params: FindManyNearbyParams): Promise<{ id: string; title: string; description: string; phone: string; latitude: Prisma.Decimal; longitude: Prisma.Decimal; }[]> {
        return this.items
            .filter(item => {
                const distance = getDistanceBetweenCoordinates(
                    { latitude: params.latitude, longitude: params.longitude},
                    { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()},
                );

                return distance < 10;
            });
    }

    async searchManyByTitle(query: string, page: number): Promise<{ id: string; title: string; description: string; phone: string; latitude: Prisma.Decimal; longitude: Prisma.Decimal; }[]> {
        return this.items
            .filter(item => item.title.includes(query))
            .slice((page - 1) * 20, page * 20);
    }

    async create(data: Prisma.GymCreateInput) {
        const gym =  {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description,
            phone: data.phone,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date()
        };

        this.items.push(gym);

        return gym;
    }

    async findById(id: string) {
        const gym = this.items.find(item => item.id === id);

        if(!gym) {
            return null;
        }

        return gym;
    }
}