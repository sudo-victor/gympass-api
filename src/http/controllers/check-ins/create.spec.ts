import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'Javascript Gym',
                description: 'Some description',
                phone: '21999999999',
                latitude: -22.9640629,
                longitude: -43.404249,
            }
        });

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -22.9640629,
                longitude: -43.404249,
            });

        expect(response.statusCode).toEqual(201);
    });
});