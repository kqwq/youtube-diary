import express from 'express';
var router = express.Router();
import fs from 'fs';

router.get('/', function(req, res, next) {
  res.render('index', { title: '404' });
});

router.get('/channelIds', function(req, res, next) {
  res.json(JSON.parse(fs.readFileSync('./data/channelIds.json', 'utf8')));
});

router.get('/channel/:id', function(req, res, next) {
  let id = req.params.id;
  res.json(JSON.parse(fs.readFileSync('./data/channel/' + id + '.json', 'utf8')));
});

export default router;
