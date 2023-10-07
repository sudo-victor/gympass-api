import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: 'Javascript Gym',
                description: 'Some description',
                phone: '21999999999',
                latitude: -22.9640629,
                longitude: -43.404249,
            }
        });

        let checkIn = await prisma.checkIn.create({
            data: { gym_id: gym.id, user_id: user.id },
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(204);

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id
            }
        });
        
        expect(checkIn.validated_at).toEqual(expect.any(Date));
    });
});