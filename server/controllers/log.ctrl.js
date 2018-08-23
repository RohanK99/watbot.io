var Log = require('../models/log');
var fetch = require('node-fetch');

const CONTRIBUTEURL =  "https://docs.google.com/spreadsheets/d/1Q6ksxv_JRXVJAQ8T5mebS1lF87wJla7swKLhh6znHhg/edit?usp=sharing"

const ERRORMESSAGE = [
    "Something went wrong! Try again 😕"
]

const NOMATCH = [
    `Sorry! I currently don't have an answer to your question. Consider adding it to the open source document <a href=${CONTRIBUTEURL}>here</a>`
]

exports.log = async (req, res) => {

    var answer = {}
    try {

        var response = await fetch(process.env.KNOWLEDGEBASEURL, {
            method: 'post',
            headers: {
                "Authorization": process.env.ENDPOINTKEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        })
        var jsonResponse = await response.json()
        var data = jsonResponse["answers"][0]
        if (data["score"] >= 30) {
            var blockMessage = data["answer"]
            var messages = blockMessage.split("\n")
            answer["answer"] = messages
        } else {
            answer["answer"] = NOMATCH
        }

        var requestLog = new Log ({
            "requestIP": req.headers["x-forwarded-for"],
            "userQuestion": req.body["question"],
            "matchedQuestion": data["questions"][0],
            "questionID": data["id"],
            "accuracy": data["score"]
        })
        requestLog.save((err) => {if (err) console.log ('Error on save!')});
        res.send(answer)

    } catch (error) {
        answer["answer"] = ERRORMESSAGE
        res.send(answer)
        console.log('Request failed', error)
    }
}