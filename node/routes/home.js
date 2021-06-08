require('dotenv').config();
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  const stockSymbol = req.query.symbol;
  const API_KEY = process.env.API_KEY;
  const api = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`;

  fetch(api).then(res => res.json())
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(404).send();
    });
});

module.exports = router;
