const request = require('supertest');
const app = require('../src/server');

describe('Pruebas Endpoints API DevOps', () => {
  it('Debe responder 200 OK en /health con status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('UP');
  });

  it('Debe obtener la lista de tareas en /api/v1/tasks', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});