// it is use to save user queries in mongodb
let UserChatHistory = require('../../../models/userChatHistory');
module.exports = function(email, isUnAnswered, question, answerObj) {
    UserChatHistory.findOne({
        email: email
    }, function(err, data) {
      // if data is not present then initialize a new UserChatHistory or add in existing database
        if (!data) {
            let newUserChatHistory = new UserChatHistory();
            newUserChatHistory.email = email;
            let chat = {};
            chat.isUnAnswered = isUnAnswered;
            chat.question = question;
            chat.answerObj = answerObj;
            newUserChatHistory.chats = [];
            newUserChatHistory.chats.push(chat);
            newUserChatHistory.save(function(err, data) {
                console.log(data);
            });
        } else {
            let chat = {};
            chat.isUnAnswered = isUnAnswered;
            chat.question = question;
            chat.answerObj = answerObj;
            chat.answerDate = new Date().toLocaleString();
            data.chats.push(chat);
            data.save(function(error) {
                if (error) {
                    console.log('Error in saving chat');
                }
            });
        }
    });
};
