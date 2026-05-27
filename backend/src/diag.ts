/**
 * diag.ts
 * Este archivo inicializa un servidor Express muy básico para diagnósticos.
 * Permite verificar rápidamente si el servidor Node puede levantarse y exponer
 * una ruta de salud (health check).
 */
import express from 'express';

// Se instancia la aplicación Express
const app = express();

// Puerto en el que se levantará el servidor de diagnóstico
const PORT = 4001;

/**
 * Ruta GET de diagnóstico (health check).
 * Retorna un JSON indicando que el estado es OK y que el servidor funciona.
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de diagnóstico funcionando' });
});

// Se arranca el servidor y se imprime un mensaje en la consola
app.listen(PORT, () => {
  console.log(`🚀 DIAGNÓSTICO: Servidor escuchando en http://localhost:${PORT}`);
});
