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
    const pose = req.query.pose;
    const midi_cc = getMidiFromPose(pose);
    if (max_api) max_api.post(midi_cc);
    if (max_api) max_api.outlet(midi_cc);
    res.sendStatus(200);
});

function getMidiFromPose(pose){
    if (pose.score > 0.4) {
        return processMidi(pose.keypoints);
    }
    else {
        return 0;
    }
    // return pose
}

function processMidi(pose_points){
    
}


