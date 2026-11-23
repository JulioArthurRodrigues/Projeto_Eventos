const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Evento = require('./models/evento');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const secret = 'yenngkndkbnkdnvd@3$';

// usuário cadastrado
const usuarios = [{ id: 1, email: 'admin@eventos.com', senha: '123456' }];

// eventos cadastrados
let eventos = [
    new Evento(1, 'Semana de Tecnologia', 'Palestras e workshops', '2026-12-05','Auditório A', 'Prof. Silva', 200, 'Tecnologia'),
    new Evento(2, 'Feira de Startups', 'Exposição de projetos', '2026-12-10','Pavilhão 2', 'Maria Souza', 500, 'Negócios'),
];

let proximoId = 3;

// POST /login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const user = usuarios.find(u => u.email === email && u.senha === senha);
    if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: '1h'
    });
    res.json({ token });
});

// Middleware de autenticação
function autenticar(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token não enviado' });
    }
    try {
        jwt.verify(header.split(' ')[1], secret);
        next();
    } 
    catch {
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}
// CRUD (todas as rotas protegidas)
app.get('/eventos', autenticar, (req, res) => res.json(eventos));
app.get('/eventos/:id', autenticar, (req, res) => {
    const ev = eventos.find(e => e.id === +req.params.id);
    ev ? res.json(ev) : res.status(404).json({ erro: 'Evento não encontrado' });
})

app.post('/eventos', autenticar, (req, res) => {
    const d = req.body;
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
    eventos.length < antes ? res.status(204).end() : res.status(404).json({
        erro: 'Evento não encontrado'
    });
});

app.listen(3000, () => console.log('API em http://localhost:3000'));