var express = require('express');
var path = require('path');
var cors = require('cors');

var homeRouter = require('./routes/home');

var app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/users', usersRouter);

app.listen(3003, () => {
  console.log('Listening on port: 3003');
});
