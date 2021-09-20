import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello world!' });
});

router.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204); 
});

export default router;