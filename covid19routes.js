// This file defines and handles all the http request from browser side.

const express = require('express');
const router = express.Router();
const { Pool, Client } = require('pg')
const pg = require('pg')
const client = new Client({
  user: 'ggl_user',
  host: '141.117.248.10',
  database: 'covid19',
  password: 'GGLuser$5192',
  port: 5432,
})
client.connect();

router.get('/tweetsdisplay', (req, res) => {
  client
    .query('SELECT * FROM twitter_stream_original_2020_05_01 WHERE has_coordinates=true LIMIT 10')
    .then(res1 => {
      res.send({'tweets':res1})
    })
    .catch(e => console.error(e.stack))
});

router.get('/FetchByKeyword/:keyword', (req, res) => {
  client.query('SELECT * FROM twitter_stream_original_2020_05_01 WHERE has_coordinates=true and tweet_text LIKE $1 LIMIT $2',['%'+req.params['keyword']+'%',10]).then(
    res2 => {
      res.send({'tweets':res2});
    }
  ).catch(e => console.error(e.stack))
});

module.exports = router;
