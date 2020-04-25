//express server
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
// max api

const max_api = (process.argv[2] == '-max') ? require('max-api') : null;


app.use(express.static(__dirname + '/public'));
app.use(router);
app.route('/');


//port to listen on
app.listen(3000, function () {
    console.log('app listening on port 3000!');
    if (max_api) max_api.post('app listening on port 3000!');
});

//root html file
app.get('/', function (req, res) {
    res.sendFile('root');
});

app.get('/convertPosenet', function (req, res) {
    const midiPose = req.query.midiPose;
    if (max_api) max_api.post(midiPose);
    if (max_api) max_api.outlet(midiPose);
    res.sendStatus(200);
});
