let getNeo4jDriver = require('../neo4j/connection');
let fs = require('fs');
delete require.cache[require.resolve('./intentLexicon.json')];
function createLexiconFiles(result) {
    let intentTerms = result.records[0]._fields[0].sort();
    let reactTerms = result.records[0]._fields[1].sort();
    fs.writeFile(__dirname + '/keywordLexicon.json', JSON.stringify(reactTerms), 'utf8');
    fs.writeFile(__dirname + '/intentLexicon.json', JSON.stringify(intentTerms), 'utf8');
}
module.exports = function() {
    // query to get all concept words and intents
    let query = `MATCH (concept:concept)WITH COLLECT(concept.name)as concepts
                 MATCH (intent:intent) return COLLECT(intent.name),concepts`;

    let session = getNeo4jDriver().session();
    session
        .run(query)
        .then(function(result) {
            // Completed!
            session.close();
            createLexiconFiles(result);
        })
        .catch(function(error) {
            console.log(error);
        });
};
