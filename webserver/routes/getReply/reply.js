// this route is used to get reply of questions asked by user
let express = require('express');
let router = express.Router();
let processQuestion = require('./functions/processQuestion');
let getQuestionResponse = require('./functions/getQuestionResponse');
let commonReply = require('./../../config/commonReply');
// answerNotFoundReply json file containing response for no answer found
let answerNotFoundReply = require('./../../config/answerNotFoundReply');
let saveUnansweredQuery = require('./functions/saveUnansweredQuery');
let saveUserQueries = require('./functions/saveUserQueries');
let saveAnalyticsData = require('./functions/saveAnalyticsData');
// getKeywordResponse json file containing statements for keyword responses
let getKeywordResponse = require('./functions/getKeywordResponse');
// router to take question and give reply to user
router.post('/askQuestion', function(req, res) {
    // get the user email
    let email = req.user.local.email || req.user.facebook.email || req.user.google.email;
    let username = req.body.username;
    let question = req.body.question;
    // extract intents and keywords from the question
    let query = processQuestion(question.value.toLowerCase());
    let keywords = query.keywords;
    let intents = query.intents;
    // function used to send final response
    let sendResponse = function(isUnAnswered, answerObj) {
      // function to save analytics data
        saveAnalyticsData(isUnAnswered);
        // function to save user queries
        saveUserQueries(email, isUnAnswered, question, answerObj);
        // isUnAnswered used to indentify unanswered questions
        res.json({isUnAnswered: isUnAnswered, answerObj: answerObj});
    };
    // callback if a answer is found in the graph database
    let answerFoundCallback = function(answerObj) {
        sendResponse(false, answerObj);
    };
    // callback method to tackle situation when answer is not present in database
    let noAnswerFoundCallback = function() {
        saveUnansweredQuery(username, email, question.value, keywords, intents);
        // get a random response string from answerNotFoundReply json
        let foundNoAnswer = answerNotFoundReply[Math.floor(Math.random() *
           answerNotFoundReply.length)];
        let resultArray = [];
        let resultObj = {};
        resultObj.value = foundNoAnswer;
        resultArray.push(resultObj);
        sendResponse(true, resultArray);
    };
    if (keywords.length === 0) {
        saveUnansweredQuery(username, email, question.value);
        // get a random response string from keyword response found
        let foundNoAnswer = commonReply[Math.floor(Math.random() * commonReply.length)];
        let resultArray = [];
        let resultObj = {};
        resultObj.value = foundNoAnswer;
        resultArray.push(resultObj);
        sendResponse(true, resultArray);
    }
    else if(intents.length === 0) {
      saveUnansweredQuery(username, email, question.value);
      // if no intent is found in the question then get a keyword response
      getKeywordResponse(keywords, sendResponse);
    }
     else {
       // function to get response when both  intents and keywords are present
        getQuestionResponse(intents, keywords, answerFoundCallback, noAnswerFoundCallback);
    }
});
module.exports = router;
