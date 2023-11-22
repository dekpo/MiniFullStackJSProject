// get the client
const mysql = require('mysql2');
const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use('/', express.static('public'));
app.use(parser.urlencoded({ extended: true }));
app.listen(port);

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3333',
  user: 'root',
  password: 'root',
  database: 'oop_mvc_php'
});

const displayResults = (request, response) => {
  const limit = !isNaN(request.query.limit) ? parseInt(request.query.limit) : 3;
  const page = !isNaN(request.query.page) ? parseInt(request.query.page - 1) * limit : 0;
  // simple query
  connection.query(
    'SELECT * FROM `picture` ORDER BY id DESC LIMIT ' + page + ',' + limit,
    function (err, results, fields) {
      response.send(results);
      console.log(err);
    }
  );
}

app.get('/api', displayResults);

app.post('/api', (request, response) => {

  const title = request.body.title;
  const description = request.body.description;
  const src = request.body.src;
  const author = request.body.author;

  connection.query(
    "INSERT INTO `picture` (`title`, `description`, `src`, `author`) VALUES (?,?,?,?)",
    [title, description, src, author],
    function (err, results, fields) {
      //cconsole.log(results); // results contains rows returned by server
      // console.log(err);
      response.redirect('/');
      // response.send("Nouvel picture insérée avec succès !<a href='javascript:history.back()'>Retour en arrière</a>");
    }
  );


});