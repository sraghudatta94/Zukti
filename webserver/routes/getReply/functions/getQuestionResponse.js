// get reaponse of the question asked by user from neo4j database
let getNeo4jDriver = require('../../../neo4j/connection');
module.exports = function(intents, keywords, answerFoundCallback, noAnswerFoundCallback) {
    let query = `UNWIND ${JSON.stringify(intents)} AS token
                 MATCH (n:intent)
                 WHERE n.name = token
                 OPTIONAL MATCH (n)-[r:same_as]->(main)
                 WITH  LAST(COLLECT(main.name)) AS intent
                 UNWIND ${JSON.stringify(keywords)} AS token
                 MATCH (n:concept)
                 WHERE n.name = token
                 OPTIONAL MATCH (n)-[r:same_as]->(main)
                 WITH COLLECT(main) AS baseWords,intent AS intent
                 UNWIND baseWords AS token
                 MATCH (token)-[r:subconcept*]->(:concept {name:'react'})
                 WITH MAX(SIZE(r)) AS max,baseWords AS baseWords,intent AS intent
                 UNWIND baseWords AS bw
                 MATCH (bw)-[r:subconcept*]->(:concept {name:'react'})
                 WHERE SIZE(r) = max WITH COLLECT(bw) AS bws,intent AS intent
                 UNWIND bws AS keywords
                 MATCH (keywords)<-[r]-(q:question)-[rel:answer]->(a)
                 WHERE TYPE(r)=intent
                 WITH a as a, rel as rel
                 ORDER BY rel.rating DESC
                 RETURN LABELS(a),COLLECT(a.value) `;

    let session = getNeo4jDriver().session();
    session
        .run(query)
        .then(function(result) {
            // Completed!
            session.close();
                  if (result.records.length === 0) {
                noAnswerFoundCallback();
            } else {
                let answerObj = {};
                answerObj.time = new Date().toLocaleString();
                let resultArray = result.records.forEach((record) => {
                    let field = record._fields;
                    answerObj[field[0][0]] = field[1].map((value, index) => {
                        if (value !== '') {
                            return {
                                value: value
                            };
                        }
                    });
                });
// sending the answer to callback
                answerFoundCallback(answerObj);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
};
