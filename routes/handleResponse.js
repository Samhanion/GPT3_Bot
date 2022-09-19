var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/handle', function (req, res, next) {
  console.log(req.body);
  res.send('done!');
});

module.exports = router;
