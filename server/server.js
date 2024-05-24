const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8000;

const pool = new Pool({
  user: 'uonijdmh9p45aknnawyv',
  host: 'bfqmdez0scyr7lxs8ps5-postgresql.services.clever-cloud.com',
  password: 'YC5ryOsie3IXWKNHcviu4ygbhakXBx',
  database: 'bfqmdez0scyr7lxs8ps5',
  port: 50013,
});


app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE f_name = $1";
    const result = await pool.query(query, [username]);
    if (result.rows.length > 0 && password === result.rows[0].pass) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = 'INSERT INTO users (f_name, pass, email) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [username, password, email]);

    res.status(201).json({ message: 'Registration successful', user: result.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'User already exists' }); 
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/book', async (req, res) => {
  const { name, people, date, time, mobile } = req.body;

  if (people < 1) {
    return res.status(400).json({ error: 'Number of people must be at least 1' });
  }

  try {
    const query = 'INSERT INTO bookings (name, people, date, time, mobile) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [name, people, date, time, mobile]);
    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'An error occurred while creating the booking', details: error.message });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
});

app.post('/cart', async (req, res) => {
  const { item_name, quantity, price, img } = req.body;
  try {
    const query = 'INSERT INTO cart (item_name, quantity, price, img) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [item_name, quantity, price, img]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding item to cart', details: error.message });
  }
});

// Fetch cart items
app.get('/cart', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'An error occurred while fetching cart items' });
  }
});

// Remove item from cart
app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM cart WHERE id = $1';
    await pool.query(query, [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'An error occurred while removing item from cart' });
  }
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
