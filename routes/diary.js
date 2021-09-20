import express from 'express';
import { User } from '../models/list.js';


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '404' });
});

router.get('/channelIds', function(req, res, next) {
  // limit to 1-1000, default to 10
  let theLimit = parseInt(req.query.limit) || 10;
  theLimit = Math.min(Math.max(theLimit, 1), 1000); 

  // Search by regex
  let mongoQuery = {};
  if (req.query.search) {
    let theRegex = new RegExp(escapeRegExp(req.query.search), 'i');
    mongoQuery = {$or: [
      {'channelId': {$regex: theRegex}},
      {'name': {$regex: theRegex}},
    ]};
  }

  // Get top 100 channel ids by number of subscribers and sort by descending order
  User.find(mongoQuery, "channelId name diaryLength").sort({ diaryLength: -1 }).limit(theLimit).exec(function(err, docs) {
    if (err) {
      console.log(err);
    }
    res.json(docs);
  });
});

router.get('/channel/:id', function(req, res, next) {
  User.findOne({ channelId: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
    }
    res.json(user);
  })
});

export default router;
