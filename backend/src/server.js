import express from 'express';
import cors from 'cors';
import livroRoutes from './routes/livroRoutes.js';

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROTAS
app.use('/livro', livroRoutes);

// INICIAR O SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
