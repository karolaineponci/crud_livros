import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// CONEXÃO COM O SEU BANCO DE DADOS MYSQL
const pool = mysql.createPool({
    host: 'localhost',
    password: '29062003',       
    database: 'dsw_crud'
});

const app = express();
app.use(cors());
app.use(express.json());

// 1. LISTAR TODOS OS LIVROS DO BANCO
app.get('/livro', async (req, res) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM livros');
        res.json(linhas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar livros no banco de dados.' });
    }
});

// 2. BUSCAR UM LIVRO ESPECÍFICO PELO ID
app.get('/livro/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [linhas] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
        
        if (linhas.length === 0) return res.status(404).json({ error: 'Livro não encontrado.' });
        res.json(linhas[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o livro.' });
    }
});

// 3. ADICIONAR NOVO LIVRO NO MYSQL
app.post('/livro', async (req, res) => {
    try {
        const { titulo, preco, estoque } = req.body;
        
        const [resultado] = await pool.query(
            'INSERT INTO livros (titulo, preco, estoque) VALUES (?, ?, ?)',
            [titulo, parseFloat(preco), parseInt(estoque, 10)]
        );

        res.status(201).json({ id: resultado.insertId, titulo, preco, estoque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar o livro.' });
    }
});

// 4. ATUALIZAR UM LIVRO NO MYSQL
app.put('/livro/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { titulo, preco, estoque } = req.body;

        const [resultado] = await pool.query(
            'UPDATE livros SET titulo = ?, preco = ?, estoque = ? WHERE id = ?',
            [titulo, parseFloat(preco), parseInt(estoque, 10), id]
        );

        if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Livro não encontrado.' });
        res.json({ id, titulo, preco, estoque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o livro.' });
    }
});

// 5. DELETAR UM LIVRO NO MYSQL
app.delete('/livro/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [resultado] = await pool.query('DELETE FROM livros WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Livro não encontrado.' });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o livro.' });
    }
});

app.listen(3000, () => console.log(`Servidor rodando na porta 3000`));