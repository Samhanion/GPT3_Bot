var express = require('express');
var router = express.Router();

const { handleResponseController, getConversation, createConversation, updateConversation } = require('../controllers/handleReponseController');

router.post('/handle', handleResponseController);
router.get('/conversation', getConversation);
router.post('/conversation', createConversation);
router.post('/conversationEntry', updateConversation);

module.exports = router;
