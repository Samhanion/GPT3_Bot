var express = require('express');
var router = express.Router();
const axios = require('axios');
require('dotenv').config();
const OpenAI = require('openai-api');
const redis = require('redis');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const url = `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;
const client = redis.createClient({
  url,
  password: process.env.REDIS_PASSWORD,
});

router.get('/redis-test', async function (req, res, next) {
  await client.connect();
  console.log('connected to redis');

  //   await client.set('AI message', 'AI test message');
  //   await client.set('Client message', 'Client test message');

  var value = await client.get('AI message');
  if (!value) value = '';
  if (value.includes('somthing')) {
    console.log('somthing');
  }
  console.log(value);

  res.send(value);
});
module.exports = router;
