const request = require('supertest');
const app = require('../src/server'); 
const db = require('../src/database'); 

describe('API de Tareas (SQLite)', () => {
  beforeAll((done) => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
    )`, () => {
        db.run("DELETE FROM tasks", done);
    });
  });

  it('Debería responder con un array vacío al inicio (GET /api/v1/tasks)', async () => {
    const response = await request(app).get('/api/v1/tasks');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('Debería crear una nueva tarea exitosamente (POST /api/v1/tasks)', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Integrar base de datos SQLite' });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Integrar base de datos SQLite');
    expect(response.body.completed).toBe(0);
  });
});