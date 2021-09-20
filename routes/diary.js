import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/list.js';
var router = express.Router();
import fs from 'fs';

router.get('/', function(req, res, next) {
  res.render('index', { title: '404' });
});

router.get('/channelIds', function(req, res, next) {
  let theLimit = parseInt(req.query.limit) || 10;

  theLimit = Math.min(Math.max(theLimit, 1), 1000); // limit to 1-1000

  // Get top 100 channel ids by number of subscribers and sort by descending order
  User.find({}, "channelId name diaryLength").sort({ diaryLength: -1 }).limit(theLimit).exec(function(err, docs) {
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
