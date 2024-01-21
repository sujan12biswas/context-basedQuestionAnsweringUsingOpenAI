const router = require('express').Router();
const {checkingReqBody} = require('../Middlewares/checkingQuery');
const {gettingAnswer} = require('../Controllers/gettingAnswers')



//Adding the route
router.post('/getResponse',checkingReqBody,gettingAnswer);


module.exports = router;