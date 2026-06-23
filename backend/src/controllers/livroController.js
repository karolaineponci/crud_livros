import db from '../config/database.js';

export const listar = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM livros ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { titulo, preco, estoque } = req.body;

    if (!titulo || preco == null) {
      return res.status(400).json({ erro: 'Titulo e preço são obrigatórios' });
    }

    const [result] = await db.query(
      'INSERT INTO livros (titulo, preco, estoque) VALUES (?, ?, ?)',
      [titulo, preco, estoque ?? 0]
    );

    res.status(201).json({
      id: result.insertId,
      titulo,
      preco,
      estoque: estoque ?? 0,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, preco, estoque } = req.body;

    const [result] = await db.query(
      'UPDATE livros SET titulo = ?, preco = ?, estoque = ? WHERE id = ?',
      [titulo, preco, estoque, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json({ id: Number(id), titulo, preco, estoque });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM livros WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json({ mensagem: 'Livro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
