import express from 'express';
const app = express();
const PORT = 4001;

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de diagnóstico funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 DIAGNÓSTICO: Servidor escuchando en http://localhost:${PORT}`);
});
