const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

console.log('Caminho do banco de dados:', dbPath);
console.log('Caminho do schema:', schemaPath);

// Garantir que a pasta db existe
if (!fs.existsSync(path.join(__dirname, 'db'))) {
  fs.mkdirSync(path.join(__dirname, 'db'));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    // Criar tabelas se não existirem
    try {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      console.log('Schema carregado com sucesso');
      db.exec(schema, (err) => {
        if (err) {
          console.error('Erro ao executar schema:', err);
        } else {
          console.log('Schema executado com sucesso');
        }
      });
    } catch (error) {
      console.error('Erro ao ler arquivo schema:', error);
    }
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, 'seu_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  console.log('Tentativa de login:', req.body);
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    console.log('Usuário encontrado:', user);

    // Em produção, use bcrypt.compare
    if (password !== user.password) {
      console.log('Senha incorreta para:', email);
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'seu_jwt_secret',
      { expiresIn: '24h' }
    );

    console.log('Login bem sucedido para:', email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position
      }
    });
  });
});

// Rotas de usuários
app.get('/api/users', authenticateToken, (req, res) => {
  db.all('SELECT id, email, name, role, department, position FROM users', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(rows);
  });
});

// Rotas de períodos de férias
app.get('/api/vacation-periods', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin'
    ? 'SELECT * FROM vacation_periods'
    : 'SELECT * FROM vacation_periods WHERE user_id = ?';
  
  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar períodos de férias:', err);
      return res.status(500).json({ error: 'Erro ao buscar períodos de férias' });
    }
    res.json(rows);
  });
});

app.post('/api/vacation-periods', authenticateToken, (req, res) => {
  const { start_date, end_date } = req.body;
  
  db.run(
    'INSERT INTO vacation_periods (user_id, start_date, end_date, status) VALUES (?, ?, ?, ?)',
    [req.user.id, start_date, end_date, 'pending'],
    function(err) {
      if (err) {
        console.error('Erro ao criar período de férias:', err);
        return res.status(500).json({ error: 'Erro ao criar período de férias' });
      }
      res.json({ id: this.lastID, user_id: req.user.id, start_date, end_date, status: 'pending' });
    }
  );
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 