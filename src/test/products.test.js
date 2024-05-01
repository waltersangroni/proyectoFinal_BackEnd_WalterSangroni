import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('Testing products', () => {

    describe('Testing de los endpoints GET', () => {
        it('El endpoint GET /api/products debe obtener todos los productos correctamente', async () => {
            const { statusCode, _body } = await requester.get('/api/products');
            expect(statusCode).to.be.equal(200);
            expect(_body.docs).to.be.an("array");
        });

        it('El endpoint GET /api/products/:id debe obtener un solo producto por su ID correctamente', async () => {
            const { statusCode, _body } = await requester.get('/api/products');
            const id = _body.docs[0]._id;
            expect(statusCode).to.be.equal(200);
            const { statusCode: codeId, _body: productId } = await requester.get(`/api/products/${id}`);
            expect(codeId).to.be.equal(200);
            expect(productId).to.be.an("object");
            expect(productId._id).to.be.equal(id);
        });
    });
    describe('Testing de los endpoints POST', () => {
        it('El endpoint POST /api/products debe crear un producto correctamente', async () => {
            const productMock = {
                title: 'Cafe de Ecuador',
                description: 'Bebida cafe de especialidad',
                category: 'Cafe',
                price: 3350,
                thumbnail: 'https://imgur.com/D4IlFXd',
                code: 'A1',
                stock: 400
            }
            const userAdmin = {
                email: 'walterhugosangroni@gmail.com',
                password: '12345'
            }
            const loginResponse = await requester.post('/api/sessions/login').send(userAdmin);
            expect(loginResponse.statusCode).to.be.equal(302);
            const cookies = loginResponse.headers['set-cookie'];
            const tokenCookie = cookies.find(cookie => cookie.startsWith('connect.sid'));
            const token = tokenCookie.split(';')[0].split('=')[1];
            const { statusCode, _body } = await requester.post('/api/products').send(productMock).set('Cookie', tokenCookie);
            expect(statusCode).to.be.equal(201);
            expect(_body.payload).to.be.an("object");
            expect(_body.payload.code).to.be.equal(productMock.code);
            expect(_body.payload.owner).to.be.equal(userAdmin.email);
        });
    });
    describe('Testing del endpoint DELETE', () => {
        it('El endpoint DELETE /api/products/:id debe eliminar un producto correctamente', async () => {
            const userAdmin = {
                email: 'geronimomariani5@gmail.com',
                password: '12345'
            }
            const loginResponse = await requester.post('/api/sessions/login').send(userAdmin);
            expect(loginResponse.statusCode).to.be.equal(302);
            const cookies = loginResponse.headers['set-cookie'];
            const tokenCookie = cookies.find(cookie => cookie.startsWith('connect.sid'));
            const token = tokenCookie.split(';')[0].split('=')[1];
            const { statusCode, _body } = await requester.get('/api/products?limit=20');
            expect(statusCode).to.be.equal(200);
            expect(_body.docs).to.be.an('array');
            const productMock = _body.docs.find(product => product.title === 'Brahama');
            expect(productMock).to.exist;
            expect(productMock).to.be.an('object');
            const { statusCode: newStatusCode } = await requester.delete(`/api/products/${productMock._id}`).set('Cookie', tokenCookie);
            expect(newStatusCode).to.be.equal(200);
        });
    });
});