const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

// CORS Config *Needed for permissions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Allow', 'GET, POST');
  next();
});

app.use(express.json());
app.use(cors());

// MYSQL Conn Params
const conexion = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

// Connection testing
conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log('¡Conexión exitosa a la base de datos!');
  }
});

// Home route
app.get('/', function (req, res) {
  res.send('API para la conexión con arduino - proyecto USB');
});

// Main route - GET Method
app.get('/api/data', (req, res) => {
  conexion.query('SELECT * FROM data', (error, data) => {
    if (error) {
      throw error;
    } else {
      res.send(data);
    }
  });
});

// Main route - POST Method
app.post('/api/data', (req, res) => {
  let data = {
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    boolean: req.body.bool,
  };
  let sql = 'INSERT INTO data SET ?';
  conexion.query(sql, data, function (error, data) {
    if (error) {
      throw error;
    } else {
      res.send(data);
    }
  });
});

const puerto = process.env.PUERTO || 8080;
app.listen(puerto, function () {
  console.log('Servidor Ok en puerto:' + puerto);
});
