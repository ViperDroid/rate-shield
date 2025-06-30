const rateShield = require('../src');
const express = require('express');
const request = require('supertest');

const app = express();
app.use(rateShield({ windowMs: 1000, max: 2 }));

app.get('/', (req, res) => res.send('OK'));

(async () => {
  console.log('Running rate limit test...');

  const r1 = await request(app).get('/');
  const r2 = await request(app).get('/');
  const r3 = await request(app).get('/');

  console.log('1:', r1.status); // 200
  console.log('2:', r2.status); // 200
  console.log('3:', r3.status); // 429
})();
