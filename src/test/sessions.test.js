import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('Testing sessions', () => {

    describe('Testing de los endpoints POST', () => {
        it('El endopoint POST /api/sessions/register debe registrar un usuario correctamente', async () => {
            const userMock = {
                first_name: 'Walter',
                last_name: 'Test',
                email: 'test@example.com',
                age: 40,
                password: '12345'
            }
            const response = await requester.post('/api/sessions/register').send(userMock);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.ok;
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('rol');
        });
        it('El endopoint POST /api/sessions/login el usuario debe logearse correctamente', async () => {
            const userMock = {
                email: 'test@example.com',
                password: '12345'
            }
            const loginResponse = await requester.post('/api/sessions/login').send(userMock);
            expect(loginResponse.statusCode).to.be.equal(302);
        });
    });
});