let express = require('express');
let router = express.Router();
let fetchConcepts = require('./fetchConcepts');
// router to get concepts from neo4j database
router.get('/', function(req, res) {
    let resultCallback = function(concepts) {
        res.json({
            concepts
        });
    };
    // calling fetchConcepts method in neo4js
    fetchConcepts(resultCallback);
});
module.exports = router;
