let express = require('express');
let router = express.Router();
let UserChatHistory = require('./../../models/userChatHistory');
// router to retrive user chat history
router.get('/', function(req, res) {
    let email = req.query.email || req.user.local.email ||
     req.user.facebook.email || req.user.google.email;
    UserChatHistory.findOne({
        email: email
    }, function(err, data) {
        if (err) {
            res.json({restrived: false});
        } else {
            res.json(data);
        }
    });
});
module.exports = router;
