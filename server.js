const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
    pool: {
      min: 2, // minimum number of connections in the pool
      max: 50, // maximum number of connections in the pool
  },
}});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('success kdlsa');
});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/signin', (req,res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.registerHandler(req, res, db, bcrypt)})

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
