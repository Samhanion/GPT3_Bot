var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET users listing. */
router.post('/handle', async function (req, res, next) {
  console.log(req.body);

  if (req.body.status == 'RECEIVED') {
    axios
      .post(
        'https://api.sendblue.co/api/send-message',
        {
          number: '+15208700996',
          content: "The webhook received your message. Please don't reply back to this message.",
          send_style: 'fireworks',
          media_url: 'https://source.unsplash.com/random.png',
          statusCallback: 'http://imessagebot-env-1.eba-452iz3ee.us-east-1.elasticbeanstalk.com/handle',
        },
        {
          headers: {
            'sb-api-key-id': '99b1ab1984188ec4bd9f107d8e786b87',
            'sb-api-secret-key': '4c728b16d63f24ded5342744d63b06c2',
            'content-type': 'application/json',
          },
        },
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.send('done!');
});

module.exports = router;
