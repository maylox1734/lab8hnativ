const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Підключення до існуючої бази даних SQLite
const db = new sqlite3.Database('./logistics.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log('Успішно підключено до бази даних логістики.');
    }
});

// ==========================================
// CRUD для таблиці clients
// ==========================================

// GET (Read) - отримати всіх клієнтів
app.get('/client', (req, res) => {
    db.all('SELECT * FROM clients', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// POST (Create) - додати нового клієнта
app.post('/clients', (req, res) => {
    const { client_name, phone } = req.body;
    db.run(
        'INSERT INTO clients (client_name, phone) VALUES (?, ?)',
        [client_name, phone],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Клієнта додано', id: this.lastID });
        }
    );
});

// PUT (Update) - оновити дані клієнта
app.put('/clients/:id', (req, res) => {
    const { client_name, phone } = req.body;
    const { id } = req.params;
    db.run(
        'UPDATE clients SET client_name=?, phone=? WHERE id=?',
        [client_name, phone, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Дані клієнта оновлено', changes: this.changes });
        }
    );
});

// DELETE (Delete) - видалити клієнта
app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM clients WHERE id=?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клієнта видалено', changes: this.changes });
    });
});

// ==========================================
// Запуск сервера та Експорт для тестів
// ==========================================

// Запускаємо сервер ТІЛЬКИ якщо файл запускається напряму (node server.js), 
// а не імпортується тестовим фреймворком
if (require.main === module) {
    app.listen(3000, () => {
        console.log('Сервер запущено на порту 3000');
    });
}

// Експортуємо app, щоб Supertest міг робити до нього запити
module.exports = app;