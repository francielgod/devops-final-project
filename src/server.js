const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const client = require('prom-client');
const path = require('path');

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

// Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Desactiva CSP para permitir scripts del frontend
app.use(cors());
app.use(express.json());

// Servir automáticamente el index.html ubicado en src/public
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

// Endpoints de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/api/v1/tasks', (req, res) => {
  res.status(200).json([
    { id: 1, title: 'Configurar Docker', completed: true },
    { id: 2, title: 'Crear Pipeline CI/CD en GitHub Actions', completed: false }
  ]);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
