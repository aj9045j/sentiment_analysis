const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const { moviePred } = require('./routers/movieCsv.js')
const { amazonPred } = require('./routers/amazonCsv.js')
const { electionPred } = require('./routers/electionCsv.js')
const { twitterPred } = require('./routers/twitterCsv.js')
const { amazonpred } = require('./routers/amazonpred.js')
const { electionpred } = require('./routers/electionpred.js')
const { moviepred } = require('./routers/moviepred.js')
const { twitterpred } = require('./routers/twitterpred.js')


app.post('/movie', moviePred);
app.post('/amazon', amazonPred);
app.post('/election', electionPred);
app.post('/twitter', twitterPred);
app.post('/moviepred', moviepred);
app.post('/amazonpred', amazonpred);
app.post('/electionpred', electionpred);
app.post('/twitterpred', twitterpred);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
