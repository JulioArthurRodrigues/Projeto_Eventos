const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Evento = require('./models/Evento');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const SEGREDO = process.env.JWT_SECRET || 'eventos-2026';

// Usuários pré-cadastrados
const usuarios = [{ id: 1, nome: 'Administrador', email: 'admin@eventos.com', senha: '123456' }];

// Eventos previamente cadastrados (em memória)
let eventos = [
    new Evento(1, 'Lollapalooza', 'Shows nacionais e internacionais', '2027-03-21', 'Autódromo de Interlagos', 'Prefeitura de São Paulo', 100000, 'Entretenimento'),
    new Evento(2, 'Rock in Rio', 'Shows nacionais e internacionais', '2028-09-20', 'Rio de Janeiro', 'Roberto Medina', 500000, 'Entretenimento'),
];
let proximoId = 3;

// Tokens invalidados pelo logout
const tokensRevogados = new Set();

// POST /login
app.post('/login', (req, res) => {
    const { email, senha } = req.body || {};
    const user = usuarios.find(u => u.email === email && u.senha === senha);
    if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email }, SEGREDO, { expiresIn: '1h' });
    res.json({ token, usuario: { id: user.id, nome: user.nome, email: user.email } });
});

// Middleware de autenticação
function autenticar(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token não enviado' });
    }
    const token = header.split(' ')[1];
    if (tokensRevogados.has(token)) {
        return res.status(401).json({ erro: 'Token inválido (sessão encerrada)' });
    }
    try {
        jwt.verify(token, SEGREDO);
        req.token = token;
        next();
    } catch {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

// POST /logout
app.post('/logout', autenticar, (req, res) => {
    tokensRevogados.add(req.token);
    res.status(204).end();
});

// CRUD
app.get('/eventos', autenticar, (req, res) => res.json(eventos));

app.get('/eventos/:id', autenticar, (req, res) => {
    const ev = eventos.find(e => e.id === +req.params.id);
    ev ? res.json(ev) : res.status(404).json({ erro: 'Evento não encontrado' });
});

app.post('/eventos', autenticar, (req, res) => {
    const d = req.body;
    if (!d.titulo || !d.descricao || !d.data || !d.local || !d.organizador || !d.capacidade || !d.categoria) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }
    const novo = new Evento(proximoId++, d.titulo, d.descricao, d.data, d.local, d.organizador, d.capacidade, d.categoria);
    eventos.push(novo);
    res.status(201).json(novo);
});

app.put('/eventos/:id', autenticar, (req, res) => {
    const ev = eventos.find(e => e.id === +req.params.id);
    if (!ev) return res.status(404).json({ erro: 'Evento não encontrado' });
    ev.atualizar(req.body);
    res.json(ev);
});

app.delete('/eventos/:id', autenticar, (req, res) => {
    const antes = eventos.length;
    eventos = eventos.filter(e => e.id !== +req.params.id);
    eventos.length < antes ? res.status(204).end() : res.status(404).json({ erro: 'Evento não encontrado' });
});

app.listen(3000, () => console.log('API em http://localhost:3000'));