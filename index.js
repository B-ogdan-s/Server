const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json({limit: '50mb'}))

app.use((req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', 'https://b-ogdan-s.github.io');
  // Другие заголовки CORS, если необходимо
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const port = 3000;


// Парсер для обработки данных запроса в формате JSON

// создание базы данных
const db = new sqlite3.Database('mydb.sqlite');

const handleExit = () => {
  console.log('Сохранение базы данных перед закрытием сервера...');
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('База данных успешно сохранена и закрыта.');
    process.exit(0); // Завершение процесса Node.js
  });
};

// Регистрация обработчика события перед закрытием сервера
process.on('SIGINT', handleExit); // Обработка сигнала прерывания (Ctrl+C)
process.on('SIGTERM', handleExit); // Обработка сигнала завершения

// Получение всех моделей
app.get('/models', (req, res) => {
  db.all(`SELECT * FROM Models`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Получение всех материалов
app.get('/materials', (req, res) => {
  db.all(`SELECT * FROM Materials`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Получение материала по ИД
app.get('/getmaterial', (req, res) => {
  const { id } = req.query;
  db.get(`SELECT * FROM Materials WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Получение модели по ИД
app.get('/getmodel', (req, res) => {
  const { id } = req.query;
  db.get(`SELECT * FROM Models WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// добавление нового объекта
app.post('/addmodel', (req, res) => {
  const { objectUrl, materialId, imageUrl } = req.body;
  db.run(`INSERT INTO Models (objectUrl, materialId, imageUrl) VALUES (?, ?, ?)`, [objectUrl, materialId, imageUrl], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User added successfully' });
  });
});

// добавление нового материала
app.post('/addmaterial', (req, res) => {
  const { imageUrl, materialUrl } = req.body;
  db.run(`INSERT INTO Materials (imageUrl, materialUrl) VALUES (?, ?)`, [imageUrl, materialUrl], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User added successfully' });
  });
});

// запуск сервера
const server = app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});

server.on('close', () => {
  handleExit();
});