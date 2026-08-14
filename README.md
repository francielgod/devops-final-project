# 🚀 Proyecto Final DevOps - Task API App

Este proyecto demuestra la implementación de un ecosistema DevOps completo para una aplicación web (API de Tareas), integrando prácticas de Integración Continua, Entrega Continua (CI/CD), contenerización, pruebas automatizadas y monitoreo.

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js con Express
* **Base de Datos:** SQLite
* **Contenerización:** Docker & Docker Hub
* **CI/CD:** GitHub Actions
* **Pruebas:** Jest & Supertest
* **Monitoreo:** Prometheus (Métricas) y Morgan (Logs centralizados)

---

## 📖 Guía de Instalación (Local)

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   \`\`\`bash
   git clone https://github.com/francielgod/devops-final-project.git
   cd devops-final-project
   \`\`\`

2. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Ejecutar la aplicación:**
   \`\`\`bash
   npm start
   \`\`\`
   El servidor estará disponible en `http://localhost:3000`.

---

## ⚙️ Documentación del Pipeline (CI/CD)

El proyecto utiliza **GitHub Actions** para automatizar el ciclo de vida del software. El pipeline se dispara automáticamente con cada `push` o `pull request` a la rama `main` y consta de los siguientes pasos:

1. **Checkout del código:** Descarga el código fuente del repositorio.
2. **Configuración de Node.js:** Prepara el entorno con la versión 18 de Node.
3. **Instalación de dependencias:** Ejecuta `npm ci` para instalaciones limpias.
4. **Análisis Estático (Linting):** Ejecuta ESLint para garantizar la calidad del código.
5. **Pruebas Automatizadas:** Ejecuta la suite de pruebas con Jest, utilizando una base de datos SQLite en memoria (`:memory:`) para no afectar los datos reales.
6. **Construcción y Despliegue Docker:** Si todas las pruebas pasan, construye la imagen de Docker y la publica automáticamente en Docker Hub.

---

## 📋 Manual de Operaciones

### 1. Endpoints Principales
* `GET /health` - Verifica el estado de salud de la API.
* `GET /api/v1/tasks` - Obtiene todas las tareas desde SQLite.
* `POST /api/v1/tasks` - Crea una nueva tarea (Body: `{"title": "Nombre de tarea"}`).

### 2. Sistema de Monitoreo
* **Métricas:** Disponibles en `GET /metrics` en formato compatible con Prometheus.
* **Logs:** El servidor registra todas las peticiones HTTP de forma centralizada utilizando el formato estándar de Apache mediante `morgan`.
* **Alertas:** Se puede simular una alerta crítica en el sistema enviando una petición a `POST /api/v1/alert`, lo que disparará un aviso en los logs del servidor.

### 3. Ejecución con Docker
Para ejecutar la versión contenerizada directamente desde Docker Hub:
\`\`\`bash
docker run -p 3000:3000 francielbeltre/devops-task-app:latest
\`\`\`