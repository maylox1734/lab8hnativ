const request = require('supertest');
const app = require('./server'); // Підключаємо наш сервер

describe('Тестування API Логістики (Клієнти)', () => {
    
    // Тест 1: Перевірка отримання списку клієнтів
    it('GET /clients має повертати статус 200 і масив даних', async () => {
        const response = await request(app).get('/clients');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    // Тест 2: Перевірка створення нового клієнта
    it('POST /clients має створювати нового клієнта і повертати його ID', async () => {
        const newClient = {
            client_name: "Студент для Тестів",
            phone: "0001112233"
        };

        const response = await request(app)
            .post('/clients')
            .send(newClient); // Відправляємо JSON

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Клієнта додано');
        expect(response.body).toHaveProperty('id');
    });
});