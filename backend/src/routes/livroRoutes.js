import { Router } from 'express';
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
} from '../controllers/livroController.js';

const router = Router();

// crud de /livro
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;
