import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app);
        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Javascript Gym',
                description: 'Some description',
                phone: '21999999999',
                latitude: -22.9640629,
                longitude: -43.404249,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Typescript Gym',
                description: 'Some description',
                phone: '21999999999',
                latitude: -22.9640629,
                longitude: -43.404249,
            });

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'Javascript'
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Javascript Gym'
            })
        ]);
    });
});