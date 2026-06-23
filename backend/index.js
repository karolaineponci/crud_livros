import express from 'express';
import cors from 'cors';

/* CONFIGURAÇÃO DO FIREBASE ADMIN SDK */
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };

const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
});
const auth = getAuth(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

/* MIDDLEWARE DE AUTENTICAÇÃO */
const authMiddleware = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if(!accessToken){
        return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }
    try {
        const decodedToken = await auth.verifyIdToken(accessToken);
        req.user = decodedToken;
        console.log('Usuário autenticado:', decodedToken);
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Token de acesso inválido' });
    }
    next();
}

// Banco de dados temporário em memória para os Livros do seu CRUD
let livros = [
    { id: 1, titulo: "O Senhor dos Anéis", preco: 49.90, estoque: 10, criado_em: "2026-06-20T14:30:00.000Z" },
    { id: 2, titulo: "1984", preco: 34.90, estoque: 7, criado_em: "2026-06-21T09:15:00.000Z" }
];
let proximoId = 3;

// ROTAS DO CRUD DE LIVROS (AGORA PROTEGIDAS!)
app.get('/livro', authMiddleware, (req, res) => {
    res.json(livros);
});

app.get('/livro/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const livro = livros.find(l => l.id === id);
    if (!livro) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json(livro);
});

app.post('/livro', authMiddleware, (req, res) => {
    const { titulo, preco, estoque } = req.body;
    const novoLivro = {
        id: proximoId++,
        titulo,
        preco: parseFloat(preco),
        estoque: parseInt(estoque, 10),
        criado_em: new Date().toISOString()
    };
    livros.push(novoLivro);
    res.status(201).json(novoLivro);
});

app.put('/livro/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { titulo, preco, estoque } = req.body;
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: 'Livro não encontrado.' });

    livros[index] = { ...livros[index], titulo, preco: parseFloat(preco), estoque: parseInt(estoque, 10) };
    res.json(livros[index]);
});

app.delete('/livro/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: 'Livro não encontrado.' });

    livros.splice(index, 1);
    res.status(204).send();
});

app.listen(3000, () => console.log(`Servidor rodando na porta 3000`));