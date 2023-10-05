import { Gym, Prisma } from '.prisma/client';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchManyByTitle(query: string, page: number): Promise<Gym[]>
  findManyNeabry(params: FindManyNearbyParams): Promise<Gym[]>
}