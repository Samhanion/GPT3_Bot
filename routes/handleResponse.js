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

let hard_coded_responses = [
  `Great; I’m actually a fully automated helper bot for ERC filings set up by HBL CPA’s.

    We help companies file for employee retention credits, in return for a 15% comission of what we are able to get you, meaning we cover the upfront cost and only get paid if we succeed. 
    
    To continue there’s only 5 simple qualifying questions I have you can just text me back answers too. Alternatively you can apply through our form at ApplyForERC.org, and if you have  questions feel free to call us at +15208700996. 
    
    First off how many W2 employees did you have on average in 2020? (If any)`,
  `How many W2 employees did you have on average in 2021? (If any)`,
  `Did you start your business before Feb 15th 2020 or after?`,
  `Did experience a Covid 19 event that negatively affect your business in 2020 or 2021?
    This includes:
- Revenue reduction in any quarters of 2020 and/or 2021, compared to the same quarter in 2019
- Change in business hours
- Partial or full suspension of your operations
- Shutdowns of your supply chain or vendors
- Reduction in services offered
- A disruption in your business
- Inability to visit a client’s job site
- Suppliers were unable to make deliveries of critical goods or materials
- Change in job roles/functions
- Lack of Travel
- Lack of Group Meetings
`,
  `Awesome! Based on this information you qualify for having us file for your ERC. You will be receiving a call in the next 24 hours to finalize 👍🏼`,
];
const connectToRedis = async () => {
  if (client.connected) {
    console.log('connected to redis');
  } else {
    console.log('not connected to redis');
    await client.connect();
    console.log('connected to redis now!');
  }
};

/* GET users listing. */
router.post('/handle', async function (req, res, next) {
  //   GPT3 API
  // const configuration = new Configuration({
  // apiKey: process.env.OPENAI_API_KEY,
  // });
  // const openai = new OpenAIApi(configuration);

  // const response = await openai.createCompletion({
  // model: "text-davinci-002",
  // prompt: "The following is a conversation with the most successful Lead Generator. The lead generator is helpful, creative, clever, very friendly and focused on directing his client to the ERC website.\n\nLead Generator: Hey, Have you heard about ERC?\n\nClient: Nope, what's it?\nLead Generator: \n\nERC is a website that provides a lot of resources for entrepreneurs.\nClient: Mhmmm, sound pretty vague to me",
  // temperature: 0.9,
  // max_tokens: 150,
  // top_p: 1,
  // frequency_penalty: 0,
  // presence_penalty: 0.6,
  // stop: ["Lead Generator:", "Client:"],
  // });

  //   if we got a message from the client
  if (req.body.status == 'RECEIVED') {
    try {
      await client.get('AI message', async (err, value) => {
        if (err) {
          connectToRedis();
        }
        console.log(value);
      });
    } catch (err) {
      connectToRedis();
    }
    console.log(req.body);
    let imessage_config = {
      number: '+15208700996',
      content: '',
      // send_style: 'fireworks'
      //   media_url: 'https://source.unsplash.com/random.png',
      statusCallback: 'http://imessagebot-env-1.eba-452iz3ee.us-east-1.elasticbeanstalk.com/handle',
    };

    //   save the message to redis
    await client.set('Client message', req.body.content);
    if (req.body.content == 'restart bot') {
      await client.flushAll();
      imessage_config.content = 'Hey, Have you heard about ERC?';
    }

    //   get the previous AI message
    var previousMessage = await client.get('AI message');
    if (!previousMessage) previousMessage = '';
    if (previousMessage == '' && req.body.content != 'restart bot') imessage_config.content = hard_coded_responses[0];
    if (previousMessage.includes(hard_coded_responses[0])) imessage_config.content = hard_coded_responses[1];
    if (previousMessage.includes(hard_coded_responses[1])) imessage_config.content = hard_coded_responses[2];
    if (previousMessage.includes(hard_coded_responses[2])) imessage_config.content = hard_coded_responses[3];
    if (previousMessage.includes(hard_coded_responses[3]))
      (imessage_config.content = hard_coded_responses[4]), (imessage_config.send_style = 'fireworks');
    if (
      previousMessage.includes(
        'Awesome! Based on this information you qualify for having us file for your ERC. You will be receiving a call in the next 24 hours to finalize 👍🏼',
      )
    )
      return req.send('done');

    // console.log('imessage_config', imessage_config);
    axios
      .post('https://api.sendblue.co/api/send-message', imessage_config, {
        headers: {
          'sb-api-key-id': '99b1ab1984188ec4bd9f107d8e786b87',
          'sb-api-secret-key': '4c728b16d63f24ded5342744d63b06c2',
          'content-type': 'application/json',
        },
      })
      .then(async (response) => {
        // save the message to redis
        await client.set('AI message', imessage_config.content);
        console.log(response.data);
        // await client.quit();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  res.send('done!');
  //   await client.quit();
});

module.exports = router;
