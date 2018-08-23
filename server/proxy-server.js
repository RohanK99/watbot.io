// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config()

var app = express();
var log = require('./routes/log.route');
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/watbot';
var port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(uristring, { useNewUrlParser: true }, (err, db) => {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', uristring);
    }
});

// Middleware
app.use(bodyParser.json())
app.use('/proxy', log)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Listening on port ${port}`));
