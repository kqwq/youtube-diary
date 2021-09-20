var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello world!' });
});

router.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204); 
});

module.exports = router;
