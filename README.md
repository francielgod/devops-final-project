# 🚀 Proyecto Final DevOps - Task API App

![GitHub Actions Status](https://img.shields.io/github/actions/workflow/status/francielgod/devops-final-project/ci-cd.yml?branch=main&style=flat-square&logo=github)
![Docker Pulls](https://img.shields.io/docker/pulls/francielbeltre/devops-task-app?style=flat-square&logo=docker)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=nodedotjs)

Este repositorio contiene el proyecto final para la asignatura de DevOps del Instituto Tecnológico de Las Américas (ITLA). Se trata de una aplicación web y API REST desarrollada en Node.js, contenerizada con Docker y automatizada mediante un pipeline completo de Integración y Entrega Continua (CI/CD).

## 🛠️ Tecnologías y Herramientas Utilizadas

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
*   **Pruebas Unitarias/Integración:** Jest, Supertest
*   **Monitoreo y Métricas:** Prometheus (prom-client)
*   **Contenerización:** Docker, Docker Compose
*   **Automatización CI/CD:** GitHub Actions
*   **Registro de Contenedores:** Docker Hub

---

## ⚙️ Características de la Aplicación

La aplicación expone los siguientes endpoints principales:

*   `GET /`: Interfaz gráfica interactiva (Dashboard).
*   `GET /api/v1/tasks`: Devuelve una lista de tareas en formato JSON.
*   `GET /health`: Endpoint de validación de salud (Health Check) que retorna `{"status": "UP"}`.
*   `GET /metrics`: Expone métricas de rendimiento y uso en el formato estándar de Prometheus.

---

## 🔄 Arquitectura del Pipeline CI/CD

El flujo de trabajo automatizado (`.github/workflows/ci-cd.yml`) se dispara automáticamente con cada `push` o `pull_request` a la rama principal y consta de tres etapas:

1.  **Integración Continua (Calidad & Pruebas):**
    *   Descarga el código fuente.
    *   Instala las dependencias mediante `npm install`.
    *   Ejecuta análisis estático (Linter).
    *   Ejecuta la suite de pruebas unitarias y de integración con Jest.
2.  **Construcción y Publicación (Docker):**
    *   Se autentica de forma segura en Docker Hub.
    *   Construye la imagen de la aplicación (`Dockerfile`).
    *   Publica la imagen en el repositorio de Docker Hub con las etiquetas `latest` y el SHA del commit.
3.  **Despliegue Automatizado:**
    *   Simula el despliegue en un entorno de producción verificando el estado de la imagen generada.

---

## 🚀 Cómo ejecutar el proyecto localmente

### Opción 1: Usando la imagen oficial desde Docker Hub (Recomendado)

No necesitas clonar el repositorio, solo tener Docker instalado en tu máquina y ejecutar:

```bash
docker run -d -p 3000:3000 francielbeltre/devops-task-app:latest