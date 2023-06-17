const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
const port = 3000;

// Парсер для обработки данных запроса в формате JSON

// создание базы данных
const db = new sqlite3.Database('mydb.sqlite');

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

// получение моделей по ID пользователя 
app.get('/usersModels', (req, res) => {
  const { UsersId } = req.query;
  db.all(`SELECT * FROM Models WHERE UsersID = ?`, [UsersId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// получение пользователя
app.get('/readUser', (req, res) => {
  const { Name, Password } = req.query;
  db.all(`SELECT * FROM Models WHERE Name = ? and Password = ?`, [Name, Password], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// получение материалов по ID пользователя 
app.get('/usersMaterials', (req, res) => {
  const { UsersId } = req.query;
  db.all(`SELECT * FROM Materials WHERE UsersID = ?`, [UsersId], (err, rows) => {
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
  const { objectUrl, materialId, imageUrl, UsersID } = req.body;
  db.run(`INSERT INTO Models (objectUrl, materialId, imageUrl, UsersID) VALUES (?, ?, ?, ?)`, [objectUrl, materialId, imageUrl, UsersID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Model added successfully' });
  });
});

// добавление нового материала
app.post('/addmaterial', (req, res) => {
  const { imageUrl, materialUrl, UsersID} = req.body;
  db.run(`INSERT INTO Materials (imageUrl, materialUrl, UsersID) VALUES (?, ?, ?)`, [imageUrl, materialUrl, UsersID], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Material added  successfully' });
  });
});

//добавление пользователя.
app.post('/addusers', (req, res) => {
  const { Name, Password } = req.body;
  db.run(`INSERT INTO Users (Name, Password) VALUES (?, ?)`, [Name, Password], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User added successfully' });
  });
})

// запуск сервера
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
