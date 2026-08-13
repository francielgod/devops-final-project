const db = require('./database');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const client = require('prom-client');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});

app.use(helmet({ contentSecurityPolicy: false })); // Desactiva CSP para permitir scripts del frontend
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(duration);
  });
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/api/v1/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});
app.post('/api/v1/alert', (req, res) => {
  // En un entorno real, esto enviaría un mensaje a Slack, Discord o un correo
  console.warn('\n🚨 [ALERTA CRÍTICA]: Se ha disparado un evento de monitoreo manual en el sistema.\n');
  res.status(500).json({ message: 'Alerta registrada exitosamente en los logs del servidor' });
});

app.post('/api/v1/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "El título es requerido" });
  }

  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: this.lastID, title, completed: 0 });
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;