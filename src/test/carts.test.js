import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('Testing carts', () => {
    
    describe('Testing de los endpoints GET', () => {
        it('El endpoint GET /api/carts debe obtener todos los carts correctamente', async () => {
            const { statusCode, _body } = await requester.get('/api/carts');
            expect(statusCode).to.be.equal(200);
            expect(_body).to.be.an("array");
        });
        it('El endpoint GET /api/carts/:id debe obetener un solo producto por su ID', async () => {
            const { statusCode, _body } = await requester.get('/api/carts');
            expect(statusCode).to.be.equal(200);
            expect(_body).to.be.an("array");
            const idTest = _body[0]._id
            const { statusCode: newStatusCode, _body: new_body } = await requester.get(`/api/carts/${idTest}`);
            expect(newStatusCode).to.be.equal(200);
            expect(new_body).to.be.an("object");
        });
    });

    describe('Testing de los endpoints POST', () => {
        it('El endpoint POST /api/carts debe crear un carrito correctamente', async () => {
            const { statusCode, _body } = await requester.post('/api/carts').send({});
            expect(statusCode).to.be.equal(201);
            expect(_body).to.be.an("object");
        });
    });
});