let getNeo4jDriver = require('./../../neo4j/connection');
let processQuestion = require('./processQuestion');
// function to save questions and answers ioni neo4j database
module.exports = function(req, questionsAnswerSavedCallback) {
    let question = req.body.question;
    let blogs = req.body.blogs;
    let texts = req.body.texts;
    let videos = req.body.videos;
    let questionInfo = processQuestion(question);
    let keywords = questionInfo.keywords;
    let intents = questionInfo.intents;
    let mainIntent = intents[intents.length - 1];
    let blogsQuery = '';
    let textsQuery = '';
    let videoQuery = '';
    // iterate through blogs answer and save them in neo4j database
    blogs.forEach((item) => {
        let blog = item.trim();
        if (blog !== '') {
            blogsQuery = blogsQuery +
             `MERGE (q)-[:answer {rating:0}]-> (:blog {value:${JSON.stringify(blog)}}) `;
        }
    });
      // iterate through videos answer and save them in neo4j database
    videos.forEach((item) => {
        let video = item.trim();
        if (video !== '') {
            videoQuery = videoQuery +
            `MERGE (q)-[:answer {rating:0}]-> (:video {value:${JSON.stringify(video)}}) `;
        }
    });
      // iterate through texts answer and save them in neo4j database
    texts.forEach((item) => {
        let text = item.trim();
        if (text !== '') {
            textsQuery = textsQuery +
             `MERGE (q)-[:answer {rating:0}]-> (:text {value:${JSON.stringify(text)}}) `;
        }
    });
    // query to save answer of question
    let query = ` UNWIND ${JSON.stringify(keywords)}  as token
                  MATCH (n:concept)
                  WHERE n.name = token
                  OPTIONAL MATCH (n)-[r:same_as]->(main)
                  WITH COLLECT(main) AS baseWords
                  UNWIND baseWords AS token
                  MATCH (token)-[r:subconcept*]->(:concept {name:'react'})
                  WITH MAX(SIZE(r)) AS max,baseWords AS baseWords
                  UNWIND baseWords AS bw
                  MATCH (bw)-[r:subconcept*]->(:concept {name:'react'})
                  WHERE SIZE(r) = max WITH COLLECT(bw) AS bws
                  UNWIND bws AS keywords
                  MERGE (q:question {value:${
                    JSON.stringify(question)}})-[:${mainIntent}]->(keywords)
                  ${blogsQuery} ${videoQuery} ${textsQuery}
                  RETURN 1`;
    let session = getNeo4jDriver().session();
    session
        .run(query)
        .then(function(result) {
            // Completed!
            session.close();
            // callback function to send confirmation
            questionsAnswerSavedCallback(1);
        })
        .catch(function(error) {
            console.log(error);
        });
};
